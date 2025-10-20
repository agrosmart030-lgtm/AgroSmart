import Swal from 'sweetalert2';

// Exibe um alerta de sucesso
export const exibirAlertaSucesso = (titulo, texto) => {
  Swal.fire({
    icon: 'success',
    title: titulo || 'Sucesso!',
    text: texto || 'Operação realizada com sucesso.',
    confirmButtonText: 'Ok',
  });
};

// Exibe um alerta de erro
export const exibirAlertaErro = (titulo, texto) => {
  Swal.fire({
    icon: 'error',
    title: titulo || 'Erro!',
    text: texto || 'Ocorreu um erro inesperado.',
    confirmButtonText: 'Ok',
  });
};

// Exibe um alerta de informação
export const exibirAlertaInformacao = (titulo, texto) => {
  Swal.fire({
    icon: 'info',
    title: titulo || 'Informação',
    text: texto || 'Esta é uma informação importante.',
    confirmButtonText: 'Ok',
  });
};

// Exibe um alerta de aviso (warning)
export const exibirAlertaAviso = (titulo, texto) => {
  Swal.fire({
    icon: 'warning',
    title: titulo || 'Aviso!',
    text: texto || 'Por favor, preste atenção a isso.',
    confirmButtonText: 'Ok',
  });
};

// Exibe um alerta de confirmação com opções de 'Sim'/'Não'
export const exibirAlertaConfirmacao = async (titulo, texto) => {
  const resultado = await Swal.fire({
    title: titulo || 'Tem certeza?',
    text: texto || 'Você não poderá reverter esta ação!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6', 
    cancelButtonColor: '#d33', 
    confirmButtonText: 'Sim, continuar!',
    cancelButtonText: 'Cancelar',
  });
  return resultado.isConfirmed; 
};

// Exibe um diálogo com campo de entrada de texto
export const exibirDialogoInput = async (titulo, placeholder, tipoInput = 'text') => {
  const { value: textoDigitado } = await Swal.fire({
    title: titulo || 'Insira as informações',
    input: tipoInput, // Pode ser 'text', 'email', 'password', 'number', etc.
    inputPlaceholder: placeholder || 'Digite aqui...',
    showCancelButton: true,
    inputValidator: (valor) => {
      if (!valor && tipoInput !== 'file') { 
        return 'Você precisa digitar algo!';
      }
    },
  });
  return textoDigitado; 
};

