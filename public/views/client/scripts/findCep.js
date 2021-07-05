function findCep(){
    var cep = document.getElementById("cepInput").value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url).then(response =>{
        return response.json();
          }).then(data =>
          {
              document.getElementById("cityInput").value = data.localidade;
              document.getElementById("districtInput").value = data.bairro;
              document.getElementById("addressInput").value = data.logradouro;
      })
}