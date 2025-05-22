document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:8080/Beneficiarios';

    const tabelaBeneficiariosBody = document.querySelector('#tabelaBeneficiarios tbody');
    const btnAdicionar = document.getElementById('btnAdicionar');
    const modalBeneficiario = document.getElementById('modalBeneficiario');
    const fecharModal = document.querySelector('.fechar-modal');
    const formBeneficiario = document.getElementById('formBeneficiario');
    const modalTitulo = document.getElementById('modalTitulo');
    const beneficiarioIdInput = document.getElementById('beneficiarioId');
    const mensagemCarregando = document.getElementById('mensagemCarregando');
    const mensagemErro = document.getElementById('mensagemErro');
    const btnCancelarModal = document.getElementById('btnCancelar');

    let editando = false;

    const headers = {
        'Content-Type': 'application/json',
    };

    const mostrarMensagemErro = (mensagem, noModal = false) => {
        if (noModal) {
            alert(`Erro no formulário: ${mensagem}`);
        } else {
            mensagemErro.textContent = mensagem;
            mensagemErro.style.display = 'block';
        }
        mensagemCarregando.style.display = 'none';
    };

    const limparMensagemErro = (noModal = false) => {
        if (!noModal) {
            mensagemErro.textContent = '';
            mensagemErro.style.display = 'none';
        }
    };

    const abrirModal = (paraEditar = false, dadosBeneficiario = null) => {
        editando = paraEditar;
        formBeneficiario.reset();
        beneficiarioIdInput.value = '';
        limparMensagemErro(true);

        if (paraEditar && dadosBeneficiario) {
            modalTitulo.textContent = 'Editar Beneficiário';
            beneficiarioIdInput.value = dadosBeneficiario.id;
            document.getElementById('nome').value = dadosBeneficiario.nome || '';
            document.getElementById('cpf').value = dadosBeneficiario.cpf || '';
            document.getElementById('matricula').value = dadosBeneficiario.matricula || '';
            // Estes campos já estavam sendo populados:
            document.getElementById('email').value = dadosBeneficiario.email || '';
            document.getElementById('telefone').value = dadosBeneficiario.telefone || '';
            document.getElementById('plano').value = dadosBeneficiario.plano || '';
            document.getElementById('dataNascimento').value = dadosBeneficiario.dataNascimento ? new Date(dadosBeneficiario.dataNascimento).toISOString().split('T')[0] : '';
            document.getElementById('endereco').value = dadosBeneficiario.endereco || '';
        } else {
            modalTitulo.textContent = 'Adicionar Beneficiário';
        }
        modalBeneficiario.style.display = 'block';
    };

    const fecharModalFunc = () => {
        modalBeneficiario.style.display = 'none';
        formBeneficiario.reset();
        limparMensagemErro(true);
    };

    const carregarBeneficiarios = async () => {
        mensagemCarregando.style.display = 'block';
        limparMensagemErro();
        tabelaBeneficiariosBody.innerHTML = '';

        try {
            const response = await fetch(apiUrl, { method: 'GET', headers });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Erro ${response.status}: ${errorData || response.statusText}`);
            }
            const beneficiarios = await response.json();

            if (beneficiarios.length === 0) {
                tabelaBeneficiariosBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum beneficiário encontrado.</td></tr>`;
            } else {
                beneficiarios.forEach(beneficiario => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td data-label="ID">${beneficiario.id || 'N/A'}</td>
                        <td data-label="Nome">${beneficiario.nome || 'N/A'}</td>
                        <td data-label="CPF">${beneficiario.cpf || 'N/A'}</td>
                        <td data-label="Matrícula">${beneficiario.matricula || 'N/A'}</td>
                        <td data-label="Email">${beneficiario.email || 'N/A'}</td>
                        <td data-label="Telefone">${beneficiario.telefone || 'N/A'}</td>
                        <td data-label="Plano">${beneficiario.plano || 'N/A'}</td>
                        <td data-label="Ações" class="acoes-tabela">
                            <button class="btn-icon editar" data-id="${beneficiario.id}" title="Editar">
                                <span class="material-icons-sharp">edit</span>
                            </button>
                            <button class="btn-icon excluir" data-id="${beneficiario.id}" title="Excluir">
                                <span class="material-icons-sharp">delete</span>
                            </button>
                        </td>
                    `;
                    tabelaBeneficiariosBody.appendChild(tr);
                });
            }
        } catch (error) {
            console.error('Falha ao carregar beneficiários:', error);
            mostrarMensagemErro(`Falha ao carregar beneficiários: ${error.message}`);
            tabelaBeneficiariosBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Não foi possível carregar os dados. Verifique a conexão e a configuração de CORS no backend.</td></tr>`;
        } finally {
            mensagemCarregando.style.display = 'none';
        }
    };

    const salvarBeneficiario = async (beneficiarioData) => {
        let metodo;
        let urlCompleta;

        const payload = { ...beneficiarioData }; // Cria uma cópia para segurança

        if (editando && payload.id) {
            metodo = 'PUT';
            urlCompleta = `${apiUrl}/${payload.id}`;
        } else {
            metodo = 'POST';
            urlCompleta = apiUrl;
            if (!payload.id) { // Remove ID se for POST e ID for nulo/vazio (backend deve gerar)
                delete payload.id;
            }
        }

        // PONTO DE DEPURAÇÃO CRUCIAL 🎯
        console.log(`--- Preparando para ${metodo} ---`);
        console.log("URL:", urlCompleta);
        console.log("Payload para Envio:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(urlCompleta, {
                method: metodo,
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text(); // Pegar como texto primeiro
                let errorData;
                try {
                    errorData = JSON.parse(errorText); // Tentar parsear como JSON
                } catch (e) {
                    errorData = { message: errorText || response.statusText }; // Se não for JSON, usar o texto
                }
                throw new Error(`Erro ao salvar: ${response.status} - ${errorData.message || 'Verifique os dados do formulário ou o log do servidor.'}`);
            }

            fecharModalFunc();
            await carregarBeneficiarios();
        } catch (error) {
            console.error('Erro ao salvar beneficiário:', error);
            mostrarMensagemErro(error.message, true);
        }
    };

    const excluirBeneficiario = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este beneficiário?')) {
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            if (!response.ok && response.status !== 204) {
                const errorData = await response.text();
                throw new Error(`Erro ao excluir: ${response.status} - ${errorData || response.statusText}`);
            }
            await carregarBeneficiarios();
        } catch (error) {
            console.error('Erro ao excluir beneficiário:', error);
            alert(`Erro ao excluir beneficiário: ${error.message}`);
        }
    };

    btnAdicionar.addEventListener('click', () => abrirModal());
    fecharModal.addEventListener('click', fecharModalFunc);
    btnCancelarModal.addEventListener('click', fecharModalFunc);

    window.addEventListener('click', (event) => {
        if (event.target === modalBeneficiario) {
            fecharModalFunc();
        }
    });

    formBeneficiario.addEventListener('submit', async (event) => {
        event.preventDefault();
        limparMensagemErro(true);

        const dadosFormulario = {
            id: beneficiarioIdInput.value || null,
            nome: document.getElementById('nome').value.trim(),
            cpf: document.getElementById('cpf').value.trim() || null,
            matricula: document.getElementById('matricula').value.trim() || null,
            // Estes campos já estavam sendo coletados:
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('telefone').value.trim() || null,
            plano: document.getElementById('plano').value.trim() || null,
            dataNascimento: document.getElementById('dataNascimento').value || null,
            endereco: document.getElementById('endereco').value.trim() || null
        };

        // PONTO DE DEPURAÇÃO CRUCIAL 🎯
        console.log("--- Formulário Submetido ---");
        console.log("Dados Coletados do Formulário:", JSON.stringify(dadosFormulario, null, 2));

        if (!dadosFormulario.nome || !dadosFormulario.email) {
            mostrarMensagemErro('Nome e Email são obrigatórios.', true);
            return;
        }

        await salvarBeneficiario(dadosFormulario);
    });

    tabelaBeneficiariosBody.addEventListener('click', async (event) => {
        const target = event.target;
        const btnEditar = target.closest('.editar');
        const btnExcluir = target.closest('.excluir');

        if (btnEditar) {
            const id = btnEditar.dataset.id;
            mensagemCarregando.style.display = 'block';
            limparMensagemErro();
            try {
                const response = await fetch(`${apiUrl}/${id}`, { method: 'GET', headers });
                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Erro ${response.status} ao buscar beneficiário: ${errorData || response.statusText}`);
                }
                const beneficiarioParaEditar = await response.json();
                abrirModal(true, beneficiarioParaEditar);
            } catch (error) {
                console.error('Erro ao buscar beneficiário para edição:', error);
                mostrarMensagemErro(`Não foi possível carregar os dados do beneficiário para edição: ${error.message}`);
            } finally {
                mensagemCarregando.style.display = 'none';
            }
        }

        if (btnExcluir) {
            const id = btnExcluir.dataset.id;
            await excluirBeneficiario(id);
        }
    });

    carregarBeneficiarios();
});