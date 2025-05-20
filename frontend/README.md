# App Adote-me

Aplicativo mobile para adoção de animais desenvolvido com React Native e Expo.

## Tecnologias Utilizadas

- React Native
- Expo
- Supabase (Backend e Autenticação)
- React Navigation
- AsyncStorage

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
   - Crie um arquivo `lib/config.js` baseado no `config.example.js`
   - Adicione suas credenciais do Supabase

4. Execute o projeto:
```bash
npx expo start
```

## Funcionalidades

- Cadastro e login de usuários
- Perfil de usuário
- Listagem de animais para adoção
- Favoritos


## Estrutura do Projeto

```
frontend/
  ├── app/              # Rotas e telas principais
  ├── components/       # Componentes reutilizáveis
  ├── lib/             # Configurações e utilitários
  ├── hooks/           # Custom hooks
  └── context/         # Contextos do React
``` 