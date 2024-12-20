import ui from "./ui.js"
import api from "./api.js"
const filmeSet= new Set();

async function adicionarChaveAoFilme() {
  try {
    const filmes= await api.buscarFilmes()
    filmes.forEach(filme => {
      const chaveFilme = 
      `${filme.nome.trim().toLowerCase()}-${filme.genero.trim().toLowerCase()}`
      filmeSet.add(chaveFilme)
    })
  } catch (error) {
    alert("Erro ao adicionar chave ao filme")
  }
}


document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarFilmes();
  adicionarChaveAoFilme();

  const formularioFilme = document.getElementById("filme-form");
  const botaoCancelar = document.getElementById("botao-cancelar");

  formularioFilme.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);

  const campoBuscarFilmes=document.getElementById("campo-pesquisa")
  campoBuscarFilmes.addEventListener("input", manipularCampoPesquisa)
})

  const regexNomeFilme=/^[A-Za-zãçíóú!.?,áé\s0-9]{1,}$/
  const regexGeneroFilme=/^[A-Za-zíóúãç!.?,áé\s]{1,}$/

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("filme-id").value
  const nome = document.getElementById("filme-nome").value
  const genero = document.getElementById("filme-genero").value
  const data= document.getElementById("filme-data").value

  const chaveNovoFilme=`${nome.trim().toLowerCase()}-${genero.trim().toLowerCase()}`

  if (filmeSet.has(chaveNovoFilme)) {
    alert("Esse filme já existe")
    return
  }


  if (!validaData(data)){
    alert("Não é possível inserir datas futuras. Favor selecionar outra data")
  }


  function removerEspacos(string){
    return string.replaceAll(/\s+/g,'')
}

  const nomeSemEspacos = removerEspacos(nome)
  const generoSemEspacos = removerEspacos(genero)

  function validaNomeFilme(nome){
    return regexNomeFilme.test(nome)
  }

  if(!validaNomeFilme(nomeSemEspacos)) {
    alert("O filme só pode conter letras e números")
    return
  }

  function validaGeneroFilme(genero){
    return regexGeneroFilme.test(genero)
  }

  if(!validaGeneroFilme(generoSemEspacos)) {
    alert("O gênero do filme só pode conter letras")
    return
  }

  try {
    if (id) {
      await api.editarFilme({ id, nome, genero, data })
    } else {
      await api.salvarFilme({ nome, genero, data })
    }
    ui.renderizarFilmes()
  } catch {
    alert("Erro ao salvar filme")
  }
  

}



function manipularCancelamento() {
  ui.limparFormulario()
}

async function manipularCampoPesquisa(){
  try {
    const termoPesquisado=document.getElementById("campo-pesquisa").value;
    const filmesFiltrados=await api.buscarFilmePorTermo(termoPesquisado);
    ui.renderizarFilmes(filmesFiltrados);
  } catch (error) {
    alert("Erro ao buscar filme")
  }

}

function validaData(data){
  const dataAtual= new Date();
  const dataInserida=new Date(data);

  return dataInserida<=dataAtual
}