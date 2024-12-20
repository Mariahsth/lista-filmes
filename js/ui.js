import api from "./api.js"

const ui = {

  async preencherFormulario(filmeId) {
    const filme = await api.buscarFilmePorId(filmeId)
    document.getElementById("filme-id").value = filme.id
    document.getElementById("filme-nome").value = filme.nome
    document.getElementById("filme-genero").value = filme.genero
    document.getElementById("filme-data").value = filme.data.toISOString().split("T")[0]
    document.getElementById("filme-form").scrollIntoView()
  },

  limparFormulario() {
    document.getElementById("filme-form").reset()
  },

  async renderizarFilmes(filmesFiltrados) {
    const listaFilmes = document.getElementById("lista-filmes")
    listaFilmes.innerHTML = ""
  
    try {
      let filmesParaRenderizar

      if (filmesFiltrados) {
        filmesParaRenderizar = filmesFiltrados
      } else {
        filmesParaRenderizar = await api.buscarFilmes()
      }

      filmesParaRenderizar.forEach(ui.adicionarFilmeNaLista)
    } catch {
      alert('Erro ao renderizar filmes')
    }
  },

  adicionarFilmeNaLista(filme) {
    const listaFilmes = document.getElementById("lista-filmes")
    const li = document.createElement("li")
    li.setAttribute("data-id", filme.id)
    li.classList.add("li-filme")

    const filmeNome = document.createElement("div")
    filmeNome.textContent = filme.nome
    filmeNome.classList.add("filme-nome")

    const filmeGenero = document.createElement("div")
    filmeGenero.textContent = filme.genero
    filmeGenero.classList.add("filme-genero")


    const filmeData = document.createElement("div")
    filmeData.textContent = filme.data;
    filmeData.classList.add("filme-data")

    const botaoEditar = document.createElement("button")
    botaoEditar.classList.add("botao-editar")
    botaoEditar.onclick = () => ui.preencherFormulario(filme.id)

    const iconeEditar = document.createElement("img")
    iconeEditar.src = "assets/imagens/icone-editar.png"
    iconeEditar.alt = "Editar"
    botaoEditar.appendChild(iconeEditar)

    const botaoExcluir = document.createElement("button")
    botaoExcluir.classList.add("botao-excluir")
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirFilme(filme.id)
        ui.renderizarFilmes()
      } catch (error) {
        alert("Erro ao excluir filme")
      }
    }

    const iconeExcluir = document.createElement("img")
    iconeExcluir.src = "assets/imagens/icone-excluir.png"
    iconeExcluir.alt = "Excluir"
    botaoExcluir.appendChild(iconeExcluir)

    const botaoFavoritar=document.createElement("button");

    const iconeFavoritar=document.createElement("img");
    iconeFavoritar.src=filme.favorito? "assets/imagens/icone-favorito.png":"assets/imagens/icone-favorito_outline.png";
    iconeFavoritar.alt="Favoritar";
    botaoFavoritar.appendChild(iconeFavoritar);

    botaoFavoritar.onclick=async()=>{
      try {
        await api.atualizarFavorito(filme.id, !filme.favorito)
      } catch (error) {
        alert("Erro no botão de favoritar")
      }
    }

    const icones = document.createElement("div")
    icones.classList.add("icones")
    icones.appendChild(botaoFavoritar);
    icones.appendChild(botaoEditar)
    icones.appendChild(botaoExcluir)

    li.appendChild(filmeNome)
    li.appendChild(filmeGenero)
    li.appendChild(filmeData)
    li.appendChild(icones)
    listaFilmes.appendChild(li)
  }
}

export default ui
