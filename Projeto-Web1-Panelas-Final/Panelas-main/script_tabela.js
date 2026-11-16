document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("tabela-corpo");

    fetch("tabela.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo JSON.");
            }
            return response.json();
        })
        .then(dados => {
            tbody.innerHTML = "";

            dados.forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <th scope="row" class="text-start ps-3 fw-semibold">${item.ingrediente}</th>
                    <td>${item.meia}</td>
                    <td class="table-warning fw-bold">${item.original}</td>
                    <td>${item.vezemeia}</td>
                    <td>${item.dobrada}</td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Erro na requisição AJAX:", error);
        });
});