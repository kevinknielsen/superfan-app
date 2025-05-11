# Superfan One

![Superfan One](public/placeholder-backgrounds/hero-bg.png)

## Overview

Superfan One is a platform that connects music artists with investors, allowing fans and investors to participate in the success of music projects. The platform facilitates investment in music projects, tracks royalties, and provides a community for music enthusiasts and investors.

## Features

- **Authentication & Wallet Integration**: 
  - Secure authentication using Privy
  - Embedded wallet support
  - Multiple login methods (email, SMS, Google)
  - Wallet balance tracking for USDC on Base network

- **Investment Features**:
  - Browse and invest in music projects
  - Track investments and royalty income
  - View claims from investments
  - Royalty split management for collaborators

- **Wallet Management**:
  - Deposit and withdraw funds
  - Fund wallet via Coinbase Onramp
  - USDC balance tracking on Base network
  - Network selection (Base Mainnet/Testnet)

- **User Features**:
  - Profile management
  - Security settings with 2FA support
  - Responsive design for all devices
  - Real-time balance updates

## Tech Stack

- **Frontend**: 
  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components

- **Authentication & Wallet**:
  - Privy for authentication and wallet management
  - Base network integration
  - USDC token support
  - Coinbase Onramp for fiat-to-crypto

- **Backend & Database**:
  - Supabase for database and authentication
  - Row-level security policies
  - Real-time data synchronization

- **Development Tools**:
  - ESLint and Prettier for code formatting
  - TypeScript for type safety
  - Git for version control

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/superfan-one.git
   cd superfan-one
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
superfan-one/
├── app/                    # Next.js App Router pages
│   ├── browse/            # Browse page
│   ├── dashboard/         # Dashboard pages
│   ├── deals/            # Deals pages
│   ├── groups/           # Curators pages
│   ├── login/            # Authentication pages
│   ├── settings/         # User settings pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Root page
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── ui/              # UI components
│   └── protected-route.tsx
├── contexts/            # React contexts
│   ├── auth-context.tsx
│   └── launch-project-context.tsx
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
├── public/           # Static assets
├── styles/          # Global styles
└── types/          # TypeScript type definitions
```

## Development Workflow

### Code Style

This project uses ESLint and Prettier for code formatting. Run the linter with:

```bash
npm run lint
# or
yarn lint
```

### Adding New Features

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Implement your changes and commit them:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Deployment

### Vercel Deployment

The easiest way to deploy the application is with Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure your environment variables
4. Deploy

### Manual Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

Then, start the production server:

```bash
npm run start
# or
yarn start
```

## Future Enhancements

- Enhanced analytics dashboard
- Mobile application
- Additional payment providers
- Advanced royalty tracking
- Social features and community engagement
- Smart contract integration for tokenized investments

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
- [Privy](https://privy.io/)
- [Base](https://base.org/)
- [Supabase](https://supabase.com/)
- [Coinbase Onramp](https://www.coinbase.com/onramp)
