import express from 'express';
import bodyParser from 'body-parser';

const app = express();

//configurar a nossa aplicação para receber os dados do formulário
//você pode escolher entre duas bibliotecas: QS ou QueryString
app.use(express.urlencoded({ extended: true }));

const porta = 3000;
const host = '0.0.0.0'; //ip refere-se a todas as interfaces (placas de rede) locais


function menuView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Alunos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-link active" aria-current="page" href="/cadastrarEmpresa">Cadastrar Empresa</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
        `);
}

//implementar a funcionalidade para entregar um formulário html para o cliente
let listaEmpresas = []; // Lista global para armazenar empresas cadastradas

function cadastroEmpresaView(req, resp) {
    const { cnpj = "", razaoSocial = "", nomeFantasia = "", endereco = "", cidade = "", uf = "", cep = "", email = "", telefone = "", erros = [] } = req.body || {};

    resp.send(`
        <html>
            <head>
                <title>Cadastro de Empresas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container text-center">
                    <h1 class="mb-5">Cadastro de Empresas</h1>
                    ${erros.length > 0 ? `<div class="alert alert-danger"><ul>${erros.map(erro => `<li>${erro}</li>`).join('')}</ul></div>` : ''}
                    <form method="POST" action="/cadastrarEmpresa" class="border p-3 row g-3">
                        <div class="col-md-6">
                            <label for="cnpj" class="form-label">CNPJ</label>
                            <input type="text" class="form-control" id="cnpj" name="cnpj" value="${cnpj}">
                        </div>
                        <div class="col-md-6">
                            <label for="razaoSocial" class="form-label">Razão Social / Nome do Fornecedor</label>
                            <input type="text" class="form-control" id="razaoSocial" name="razaoSocial" value="${razaoSocial}">
                        </div>
                        <div class="col-md-6">
                            <label for="nomeFantasia" class="form-label">Nome Fantasia</label>
                            <input type="text" class="form-control" id="nomeFantasia" name="nomeFantasia" value="${nomeFantasia}">
                        </div>
                        <div class="col-md-6">
                            <label for="endereco" class="form-label">Endereço</label>
                            <input type="text" class="form-control" id="endereco" name="endereco" value="${endereco}">
                        </div>
                        <div class="col-md-4">
                            <label for="cidade" class="form-label">Cidade</label>
                            <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}">
                        </div>
                        <div class="col-md-2">
                            <label for="uf" class="form-label">UF</label>
                            <select class="form-select" id="uf" name="uf">
                                <option value="" ${uf === "" ? "selected" : ""}>Selecione</option>
                                <option value="SP" ${uf === "SP" ? "selected" : ""}>São Paulo</option>
                                <option value="RJ" ${uf === "RJ" ? "selected" : ""}>Rio de Janeiro</option>
                                <option value="MG" ${uf === "MG" ? "selected" : ""}>Minas Gerais</option>
                                <!-- Adicione outros estados -->
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="cep" class="form-label">CEP</label>
                            <input type="text" class="form-control" id="cep" name="cep" value="${cep}">
                        </div>
                        <div class="col-md-6">
                            <label for="email" class="form-label">Email</label>
                            <input type="text" class="form-control" id="email" name="email" value="${email}">
                        </div>
                        <div class="col-md-6">
                            <label for="telefone" class="form-label">Telefone</label>
                            <input type="text" class="form-control" id="telefone" name="telefone" value="${telefone}">
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </body>
        </html>
    `);
}

function cadastrarEmpresa(req, resp) {
    const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;
    const erros = [];

    // Validações
    if (!cnpj) erros.push("Por favor, informe o CNPJ.");
    if (!razaoSocial) erros.push("Por favor, informe a Razão Social ou Nome do Fornecedor.");
    if (!nomeFantasia) erros.push("Por favor, informe o Nome Fantasia.");
    if (!endereco) erros.push("Por favor, informe o Endereço.");
    if (!cidade) erros.push("Por favor, informe a Cidade.");
    if (!uf) erros.push("Por favor, selecione o UF.");
    if (!cep) erros.push("Por favor, informe o CEP.");
    if (!email) erros.push("Por favor, informe o Email.");
    if (!telefone) erros.push("Por favor, informe o Telefone.");

    if (erros.length > 0) {
        // Recarrega o formulário com os dados já preenchidos e exibe os erros
        req.body.erros = erros;
        cadastroEmpresaView(req, resp);
    } else {
        // Sucesso
        const empresa = { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone };
        listaEmpresas.push(empresa); // Adiciona a empresa na lista
        resp.redirect('/empresas'); // Redireciona para a lista de empresas
    }
}

function listarEmpresas(req, resp) {
    resp.write(`
        <html>
            <head>
                <title>Empresas Cadastradas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center mb-5">Empresas Cadastradas</h1>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Razão Social</th>
                                <th>Nome Fantasia</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>UF</th>
                                <th>CEP</th>
                                <th>Email</th>
                                <th>Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
    `);

    listaEmpresas.forEach(empresa => {
        resp.write(`
            <tr>
                <td>${empresa.cnpj}</td>
                <td>${empresa.razaoSocial}</td>
                <td>${empresa.nomeFantasia}</td>
                <td>${empresa.endereco}</td>
                <td>${empresa.cidade}</td>
                <td>${empresa.uf}</td>
                <td>${empresa.cep}</td>
                <td>${empresa.email}</td>
                <td>${empresa.telefone}</td>
            </tr>
        `);
    });

    resp.write(`
                        </tbody>
                    </table>
                    <a href="/cadastrarEmpresa" class="btn btn-primary">Cadastrar Nova Empresa</a>
                </div>
            </body>
        </html>
    `);

    resp.end();
}

// Rotas
app.get('/cadastrarEmpresa', cadastroEmpresaView);
app.post('/cadastrarEmpresa', cadastrarEmpresa);
app.get('/empresas', listarEmpresas);




app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});