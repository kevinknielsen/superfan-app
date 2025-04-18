# Superfan One

![Superfan One](public/placeholder-backgrounds/hero-bg.png)

## Overview

Superfan One is a platform that connects music artists with investors, allowing fans and investors to participate in the success of music projects. The platform facilitates investment in music projects, tracks royalties, and provides a community for music enthusiasts and investors.

## Features

- **User Authentication**: Secure login and signup functionality
- **Investment Opportunities**: Browse and invest in music projects
- **Groups**: Join investment groups led by record labels and curators
- **Portfolio Dashboard**: Track investments and royalty income
- **Wallet Management**: Deposit and withdraw funds
- **Profile Management**: Update personal and investor information
- **Responsive Design**: Fully responsive UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Authentication**: Custom auth with localStorage (for demo purposes)
- **Routing**: Next.js App Router

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/superfan-one.git
   cd superfan-one
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
superfan-one/
├── app/                    # Next.js App Router pages
│   ├── browse/             # Browse page
│   ├── dashboard/          # Dashboard pages
│   ├── deals/              # Deals pages
│   ├── groups/             # Groups pages
│   ├── login/              # Authentication pages
│   ├── settings/           # User settings pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root page
├── components/             # React components
│   ├── layout/             # Layout components (header, footer)
│   ├── ui/                 # UI components (buttons, cards, etc.)
│   └── protected-route.tsx # Authentication wrapper
├── contexts/               # React contexts
│   └── auth-context.tsx    # Authentication context
├── lib/                    # Utility functions
│   ├── image-utils.ts      # Image utility functions
│   └── utils.ts            # General utility functions
├── public/                 # Static assets
│   ├── placeholder-avatars/  # Avatar images
│   ├── placeholder-backgrounds/ # Background images
│   ├── placeholder-deals/  # Deal images
│   └── placeholder-groups/ # Group images
├── styles/                 # Global styles
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
\`\`\`

## Development Workflow

### Code Style

This project uses ESLint and Prettier for code formatting. Run the linter with:

\`\`\`bash
npm run lint
# or
yarn lint
\`\`\`

### Adding New Features

1. Create a new branch for your feature:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. Implement your changes and commit them:
   \`\`\`bash
   git add .
   git commit -m "Add your feature description"
   \`\`\`

3. Push your branch and create a pull request:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

## Deployment

### Vercel Deployment

The easiest way to deploy the application is with Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure your environment variables
4. Deploy

### Manual Deployment

To build the application for production:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

Then, start the production server:

\`\`\`bash
npm run start
# or
yarn start
\`\`\`

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
\`\`\`

## Authentication

For demonstration purposes, this project uses a simplified authentication system with localStorage. In a production environment, you should implement a more secure authentication solution.

## Mock Data

The application currently uses mock data for demonstration purposes. In a production environment, you would connect to a real backend API.

## Future Enhancements

- Integration with real payment providers
- Smart contract integration for tokenized investments
- Real-time notifications
- Enhanced analytics dashboard
- Mobile application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
