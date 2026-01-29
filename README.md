# 🌤️ App de Previsão do Tempo

Um aplicativo web moderno de previsão do tempo criado com Python, HTML, CSS e JavaScript.

## 🎯 Funcionalidades

- ✅ Busca de previsão do tempo por cidade
- ✅ Exibição do tempo atual com temperatura e detalhes (umidade, vento, sensação térmica)
- ✅ Previsão por hora (próximas 24 horas)
- ✅ Previsão de 7 dias
- ✅ Interface responsiva e intuitiva
- ✅ Emojis indicadores de condições climáticas
- ✅ Dados em tempo real (API gratuita)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.8+** - Linguagem de programação
- **Flask** - Framework web minimalista
- **Flask-CORS** - Suporte a CORS
- **Requests** - Biblioteca HTTP

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização com animações
- **JavaScript (Vanilla)** - Interatividade
- **Open-Meteo API** - Dados de previsão do tempo (gratuita, sem API key)

## 📦 Instalação

### 1. Clonar ou baixar o projeto
```bash
cd pot
```

### 2. Criar ambiente virtual (opcional, mas recomendado)
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 3. Instalar dependências
```bash
pip install -r requirements.txt
```

## 🚀 Como Usar

### 1. Executar a aplicação
```bash
python app.py
```

### 2. Acessar a aplicação
Abra o navegador e vá para: **http://localhost:5000**

### 3. Buscar uma cidade
- Digite o nome de uma cidade na caixa de busca
- Pressione Enter ou clique no botão "Buscar"
- Veja a previsão do tempo aparecer na tela

## 📁 Estrutura do Projeto

```
pot/
├── app.py                  # Backend Flask
├── requirements.txt        # Dependências Python
├── templates/
│   └── index.html         # Página principal
└── static/
    ├── style.css          # Estilos
    └── script.js          # Lógica do frontend
```

## 🎨 Interface

A aplicação possui uma interface moderna com:
- Cartão principal com informações do tempo atual
- Grid de previsão por hora com emojis
- Grid de previsão de 7 dias
- Design responsivo (mobile, tablet, desktop)
- Animações suaves
- Esquema de cores gradiente

## 📊 Dados Exibidos

### Tempo Atual
- Temperatura atual
- Sensação térmica
- Umidade
- Velocidade do vento
- Direção do vento
- Descrição das condições

### Previsão Horária
- Hora
- Temperatura prevista
- Probabilidade de chuva
- Condição climática (emoji)

### Previsão de 7 Dias
- Data
- Temperatura máxima e mínima
- Probabilidade de chuva
- Precipitação total
- Condição climática (emoji)

## 🔌 API Utilizada

**Open-Meteo API** - https://open-meteo.com/
- ✅ Grátis (sem limite de requisições)
- ✅ Sem necessidade de API key
- ✅ Cobertura global
- ✅ Dados meteorológicos confiáveis

## 🌐 Cidades Sugeridas (Exemplos)

A aplicação vem com sugestões pré-carregadas:
- São Paulo
- Rio de Janeiro
- Salvador
- Brasília
- Nova York
- Londres

Você pode buscar **qualquer cidade do mundo**!

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Erro: "Connection refused"
- Certifique-se de que o servidor está rodando em http://localhost:5000
- Verifique se a porta 5000 não está em uso por outro programa

### Erro: "Cidade não encontrada"
- Verifique a ortografia do nome da cidade
- Tente usar o nome em português ou inglês
- Algumas cidades pequenas podem não estar no banco de dados

## 💡 Melhorias Futuras

- [ ] Adicionar geolocalização automática
- [ ] Salvar cidades favoritas
- [ ] Modo escuro/claro
- [ ] Múltiplas unidades de temperatura (C/F)
- [ ] Alertas de clima severo
- [ ] Histórico de buscas
- [ ] Integração com mapas

## 📝 Licença

Projeto livre para uso pessoal e educacional.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou fazer pull requests.

---

**Desenvolvido com ❤️ por [Seu Nome]**
