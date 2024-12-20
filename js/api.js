const url = "http://localhost:3000"

const converterStringParaData=(dataString)=>{
  const [ano] = dataString.split("-");
  return ano;
}

const api = {
  async buscarFilmes() {
    try {
      const response = await axios.get(`${url}/filmes`);
      const filmes=await response.data
      return filmes.map(filme=>{
        return {
          ...filme,
          data: converterStringParaData(filme.data)
        }
      })
    }
    catch {
      alert('Erro ao buscar filmes')
      throw error
    }
  },

  async salvarFilme(filme) {
    try {
      const response = await axios.post(`${url}/filmes`, {
        ...filme,
        data: converterStringParaData(filme.data)
      })
      return await response.data
    }
    catch {
      alert('Erro ao salvar filme')
      throw error
    }
  },

  async buscarFilmePorId(id) {
    try {
      const response = await axios.get(`${url}/filmes/${id}`)
      const filme = await response.data
      return {
        ...filme,
        data: converterStringParaData(filme.data)
      }
    }
    catch {
      alert('Erro ao buscar filme')
      throw error
    }
  },

  async editarFilme(filme) {
    try {
      const response = await axios.put(`${url}/filmes/${filme.id}`, {
        ...filme,
        data: converterStringParaData(filme.data)
      })
      return await response.data
    }
    catch {
      alert('Erro ao editar filme')
      throw error
    }
  },

  async excluirFilme(id) {
    try {
      const response = await axios.delete(`${url}/filmes/${id}`)
    }
    catch {
      alert('Erro ao excluir um filme')
      throw error
    }
  },

  async buscarFilmePorTermo(termo){
    try {
      const termoEmMinusculas=termo.toLowerCase();
      const filmes= await this.buscarFilmes();
      const filmesFiltrados=filmes.filter(filme=>{
        return filme.nome.toLowerCase().includes(termoEmMinusculas) || filme.genero.toLowerCase().includes(termoEmMinusculas)
      })
      return filmesFiltrados
    } catch (error) {
      alert("Erro ao procurar filme")
    }
  },

  async atualizarFavorito(id, favorito){
    try {
      const response= await axios.patch(`${url}/filmes/${id}`, {favorito})
      return await response.data
    } catch (error) {
      alert("Erro ao favoritar filme");
      throw error
    }
  }


}

export default api