export const formatDate = (dateString) => {
    try {
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }
      return new Date(dateString).toLocaleString('pt-BR', options)
    } catch {
      return 'Data inválida'
    }
  }