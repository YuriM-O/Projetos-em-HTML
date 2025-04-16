document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');
    const listaProdutos = document.getElementById('lista-produtos');
    const chaveLocalStorage = 'listaDeProdutos';
    let produtos = carregarProdutosDoLocalStorage(); // Carrega os dados ao iniciar
    let proximoId = calcularProximoId(); // Calcula o próximo ID com base nos dados existentes

    // Elementos do formulário de edição
    const edicaoContainer = document.getElementById('edicao-container');
    const edicaoForm = document.getElementById('edicao-form');
    const editIdInput = document.getElementById('edit-id');
    const editNomeInput = document.getElementById('edit-nome');
    const editDescricaoInput = document.getElementById('edit-descricao');
    const editPrecoInput = document.getElementById('edit-preco');
    const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');
    const cadastroContainer = document.getElementById('cadastro-container');
    let produtoEmEdicao = null; // Variável para rastrear o produto sendo editado

    function carregarProdutosDoLocalStorage() {
        const dataSalva = localStorage.getItem(chaveLocalStorage);
        return dataSalva ? JSON.parse(dataSalva) : [];
    }

    function salvarProdutosNoLocalStorage() {
        localStorage.setItem(chaveLocalStorage, JSON.stringify(produtos));
    }

    function calcularProximoId() {
        if (produtos.length > 0) {
            const maxId = Math.max(...produtos.map(produto => produto.id));
            return maxId + 1;
        }
        return 1;
    }

    function gerarIdUnico() {
        return proximoId++;
    }

    function adicionarProduto(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const preco = parseFloat(document.getElementById('preco').value);

        if (nome && !isNaN(preco)) {
            const novoProduto = {
                id: gerarIdUnico(),
                nome: nome,
                descricao: descricao,
                preco: preco
            };

            produtos.push(novoProduto);
            salvarProdutosNoLocalStorage(); // Salva após adicionar
            atualizarListaProdutos();
            cadastroForm.reset();
        } else {
            alert('Por favor, preencha o nome e um preço válido.');
        }
    }

    function atualizarListaProdutos() {
        listaProdutos.innerHTML = '';

        produtos.forEach(produto => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${produto.nome} - R$ ${produto.preco.toFixed(2)}</span>
                <div class="acoes">
                    <button class="editar-btn" data-id="${produto.id}">Editar</button>
                    <button class="excluir-btn" data-id="${produto.id}">Excluir</button>
                </div>
            `;
            listaProdutos.appendChild(listItem);
        });
    }

    function excluirProduto(id) {
        const indexParaExcluir = produtos.findIndex(produto => produto.id === id);

        if (indexParaExcluir !== -1) {
            produtos.splice(indexParaExcluir, 1);
            salvarProdutosNoLocalStorage(); // Salva após excluir
            atualizarListaProdutos();
        }
    }

    function mostrarFormularioEdicao(id) {
        produtoEmEdicao = produtos.find(produto => produto.id === id);

        if (produtoEmEdicao) {
            editIdInput.value = produtoEmEdicao.id;
            editNomeInput.value = produtoEmEdicao.nome;
            editDescricaoInput.value = produtoEmEdicao.descricao;
            editPrecoInput.value = produtoEmEdicao.preco;

            cadastroContainer.style.display = 'none';
            edicaoContainer.style.display = 'block';
        }
    }

    function esconderFormularioEdicao() {
        produtoEmEdicao = null;
        edicaoForm.reset();
        edicaoContainer.style.display = 'none';
        cadastroContainer.style.display = 'block';
    }

    listaProdutos.addEventListener('click', (event) => {
        if (event.target.classList.contains('excluir-btn')) {
            const idParaExcluir = parseInt(event.target.dataset.id);
            excluirProduto(idParaExcluir);
        } else if (event.target.classList.contains('editar-btn')) {
            const idParaEditar = parseInt(event.target.dataset.id);
            mostrarFormularioEdicao(idParaEditar);
        }
    });

    edicaoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (produtoEmEdicao) {
            produtoEmEdicao.nome = editNomeInput.value.trim();
            produtoEmEdicao.descricao = editDescricaoInput.value.trim();
            produtoEmEdicao.preco = parseFloat(editPrecoInput.value);

            salvarProdutosNoLocalStorage(); // Salva após editar
            atualizarListaProdutos();
            esconderFormularioEdicao();
        }
    });

    cancelarEdicaoBtn.addEventListener('click', esconderFormularioEdicao);

    cadastroForm.addEventListener('submit', adicionarProduto);

    // Inicializa a lista carregando os dados do localStorage
    atualizarListaProdutos();
});