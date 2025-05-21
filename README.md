# App Adote-me

Aplicativo mobile para adoção de animais desenvolvido com React Native e Expo.

## Alunos
- Alexsandra Oliveira de Jesus
- Ana Karolini Blooemer Noth
- Julia Petrucci dos Santos
- Thalita Pereira Alfonso
- Henrique Carvalho Silva

## Estrutura do Projeto

```
app-adote/
  ├── frontend/         # Aplicativo React Native/Expo
  │   ├── app/         # Rotas e telas principais
  │   ├── components/  # Componentes reutilizáveis
  │   ├── lib/        # Configurações e utilitários
  │   ├── hooks/      # Custom hooks
  │   └── context/    # Contextos do React
  │
  └── backend/        # Backend (Supabase)
      └── migrations/ # Migrações do banco de dados
```

## Tecnologias Utilizadas

- React Native
- Expo
- Supabase (Backend e Autenticação)
- React Navigation
- AsyncStorage

## Configuração do Ambiente

1. Clone o repositório
2. Entre na pasta frontend:
```bash
cd frontend
```

3. Instale as dependências:
```bash
npm install
```

4. Configure o Supabase:
   - Crie um arquivo `lib/config.js` baseado no `config.example.js`
   - Adicione suas credenciais do Supabase

5. Execute o projeto:
```bash
npx expo start
```

## Funcionalidades

- Cadastro e login de usuários
- Perfil de usuário
- Listagem de animais para adoção
- Favoritos


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
