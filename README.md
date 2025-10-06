<div align="center">
  <img src="https://github.com/neel1996/supesquire/assets/47709856/2b97f1e7-6ec1-41e1-b3af-d73e1c48b4b4" alt="Quanta Read Logo" width="150"/>
  <h1>Quanta Read</h1>
  <p>An intelligent "Chat with your PDF" application powered by Next.js, Supabase, and HuggingFace.</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase">
    <img src="https://img.shields.io/badge/HuggingFace-Inference-yellow?style=for-the-badge&logo=huggingface" alt="Hugging Face">
    <img src="https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel" alt="Vercel">
  </div>
  <br/>
</div>

> **Quanta Read** enables you to have intelligent conversations with your PDF documents in real-time. It leverages HuggingFace's free inference API for powerful AI capabilities and Supabase for a secure, scalable backend.

<div align="center">

**[Live Demo](https://your-demo-url.com) • [Report a Bug](https://github.com/your-username/quanta-read/issues) • [Request a Feature](https://github.com/your-username/quanta-read/issues)**

</div>

## ✨ Key Features

-   🤖 **AI-Powered Chat**: Converse with your PDFs using state-of-the-art HuggingFace models.
-   📄 **Multi-PDF Support**: Upload and query multiple PDF documents in a single session.
-   🔍 **Semantic Search**: Find the most relevant information across all documents using vector search.
-   📝 **Auto-Summarization**: Get automatic summaries for your documents right after upload.
-   💾 **Export Conversations**: Download your chat history as TXT or JSON files.
-   🔒 **Secure & Scalable**: Built on Supabase for robust user authentication, storage, and data security.
-   🎨 **Modern UI**: A clean, responsive, and intuitive user interface built with Material-UI.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 13+ (App Router), Material-UI
-   **Backend**: Supabase (Auth, Postgres DB, Storage, Vector DB)
-   **AI/ML**: HuggingFace Inference API (`tiiuae/falcon-7b-instruct`, `sentence-transformers/all-MiniLM-L6-v2`)
-   **Orchestration**: LangChain.js
-   **Deployment**: Vercel

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **Git**
-   A **HuggingFace Account** (for API key)
-   A **Supabase Account** (for backend services)

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/quanta-read.git](https://github.com/your-username/quanta-read.git)
    cd quanta-read
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Copy the example environment file and fill it with your credentials.
    ```bash
    cp .env.example .env
    ```
    You will need to add your keys for HuggingFace and Supabase in the `.env` file.

4.  **Set Up Supabase Database**
    -   Log in to your Supabase dashboard and create a new project.
    -   Navigate to the **SQL Editor**.
    -   Open the `supabase.sql` file from this repository, copy its content, and run it in the SQL Editor to create the necessary tables and policies.

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```

6.  **Open the App**
    Navigate to `http://localhost:3000` in your browser.

## 🌍 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Connect your repository to your Vercel account.
3.  Configure the same environment variables from your `.env` file in the Vercel project settings.
4.  Deploy! Vercel will automatically handle the build process.

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve Quanta Read, please fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgments

-   **HuggingFace** for their incredible free inference APIs.
-   **Supabase** for providing a powerful and easy-to-use backend platform.
-   **Vercel** for seamless deployment and hosting.
-   **LangChain** for simplifying AI orchestration.

---
<div align="center">
  Built with ❤️ by Atharva
</div>
