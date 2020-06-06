import React,{useEffect, useState, ChangeEvent,FormEvent} from 'react'
import {Link} from 'react-router-dom'
import logo from '../assets/logo.svg'
import {FiArrowLeft} from 'react-icons/fi'
import './styles.css'
import {Map,TileLayer,Marker} from 'react-leaflet'
import api from '../../service/api'
import axios from 'axios'
import {LeafletMouseEvent, latLng} from 'leaflet'

interface item {
    id: number;
    titulo:string;
    image_url:string
}

interface IBGEuf{
    sigla:string
}

interface IBGEMunicipios{
    nome:string
}



const CreatePoint =()=>{

  const [items,setItems] =useState<item[]>([])
  const [uf,setUf] =useState<string[]>([])
  const [selected,setSelected] =useState('0')
  const [cidade,setCidade] = useState<string[]>([])
  const [cidadeSelecionada,setCidadeSelecionada] =useState('0')
  const [posicaoSelecionada,setPosicaoSelecionada]=useState<[number,number]>([0,0])
  const [posicaoInicial,setPosicaoInicial] =useState<[number,number]>([0,0])
  const [selectedItem,setSelectedItem] =useState<number[]>([]) 
  const [formData,setFormData] =useState({
      name: '',
      email: '',
      whatsapp: ''

  })
  
  
    useEffect(()=>{
      api.get('/').then(response =>{
          setItems(response.data)
      })
  },[])


  useEffect(()=>{
      axios.get<IBGEuf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
          const ufNames =response.data.map(uf=>uf.sigla)

          setUf(ufNames)
      })

  })

  useEffect(()=>{
      if(selected == '0'){
          return
      }

      axios.get<IBGEMunicipios[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selected}/municipios`)
      .then(response=>{
          const cidades =response.data.map(cidade=>cidade.nome)

          setCidade(cidades)
      })

  },[selected])


  useEffect(()=>{
      navigator.geolocation.getCurrentPosition(position=>{
          const {latitude,longitude} =position.coords

          setPosicaoInicial([latitude,longitude])
      })
  },[])


  function seletorUf(event:ChangeEvent<HTMLSelectElement>){
       
     const uf =  event.target.value

     setSelected(uf)
  }

  function seletorCidade(event:ChangeEvent<HTMLSelectElement>){

    const cidade = event.target.value

     setCidadeSelecionada(cidade)
  }
     

   function clicaMapa(event:LeafletMouseEvent){

        
       setPosicaoSelecionada([
           event.latlng.lat,
           event.latlng.lng,
       ])

   }

   function mudançaInput(event:ChangeEvent<HTMLInputElement>){
       const {name,value} =event.target

       setFormData({...formData, [name]:value})

   } 
   
   
   function itemSelect(id: number){

        const jaSelecionado =selectedItem.findIndex(item=>item===id)
        
       

        if(jaSelecionado>=0){
            const itemFiltrado =selectedItem.filter(item=>item !==id)
            setSelectedItem(itemFiltrado)
        }else{

        setSelectedItem([...selectedItem,id])
        }
   }

   function itemSubmit(event:FormEvent){

    event.preventDefault()
    const{name,email,whatsapp} =formData
    
    const [latitude,longitude] =posicaoSelecionada
    const uf = selected
    const cidade = cidadeSelecionada
    const items =selectedItem
    

    const data ={
        name,
        email,
        whatsapp,
        uf,
        cidade,
        latitude,
        longitude,
        items
    }

    console.log(data);

    

   }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                   <FiArrowLeft/>
                    Voltar para Home
                    
                </Link>
                </header>

                <form onSubmit={itemSubmit}>
                    <h1>Cadastro do ponto de<br/> coleta</h1>
                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>
                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input type="text"
                            name="name"
                            id="name"
                            onChange={mudançaInput}/>
                        </div>
                        <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Nome do Email</label>
                            <input type="text"
                            name="email"
                            id="email"
                            onChange={mudançaInput}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={mudançaInput}/>
                        </div>

                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>selecione o endereço no mapa</span>
                        </legend>
                        <Map center={posicaoInicial} zoom={15} onClick={clicaMapa}>
                            <TileLayer
                            
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={posicaoSelecionada}/>
                        </Map>
                         <div className="field-group">
                             <div className="field">
                                 <label htmlFor="uf">Estado (UF)</label>
                                 <select name="uf" 
                                 id="uf" 
                                 value={selected} 
                                 onChange={seletorUf}>
                                     <option value="0">Selecione uma UF</option>
                                     {uf.map(uf=>(
                                         <option key={uf} value={uf}>{uf}</option>
                                     ))}
                                 </select>
                             </div>
                             <div className="field">
                                 <label htmlFor="city">Cidade</label>
                                 <select 
                                 name="city" 
                                 id="city" 
                                 value={cidadeSelecionada}
                                 onChange={seletorCidade}>
                                     <option value="0">Selecione uma Cidade</option>
                                     {cidade.map(cidades=>(
                                          <option key={cidades} value={cidades}>{cidades}</option>

                                     ))}
                                 </select>
                             </div>
                             
                         </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <h2>Itens de coleta</h2>
                            <span>selecione um ou mais intems abaixo</span>
                        </legend>
                        <ul className="items-grid">
                            {items.map(item=>(
                                <li key={item.id} onClick={()=>itemSelect(item.id)}
                                className={selectedItem.includes(item.id)? 'selected': ''}>
                                <img src={item.image_url} alt="teste"/>
                                <span>{item.titulo}</span>
                                </li>
                            ))}
                            
                            
                        </ul>
                    </fieldset>
                    <button type="submit">
                        Cadastrar o item de coleta
                    </button>
                </form>

        </div>
    )
}

export default CreatePoint