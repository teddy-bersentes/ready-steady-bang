# Ready Steady Bang Online

Welcome to the GitHub repository of the online fan-made spin-off of the popular mobile game, [Ready Steady Bang](https://apps.apple.com/us/app/ready-steady-bang/id447588618)! This is a free-to-play web version that brings the fast-paced, quick-fire duelling experience to your browser. It's a great way to enjoy the game with friends or challenge other players from around the world.

This project is currently in development/pre-alpha stage and is not meant to infringe on any rights of the original creators ([Animade Studio](https://animade.tv/projects/cowboy-games)).

## Play the Game

You can play the game by visiting [https://ready-steady-bang.onrender.com](https://your-website-url.com/).

## Features

- Private multiplayer duel
- Online public lobbies
- More coming soon…

## Tech Stack

This project is built using the following technologies:

- 🎛️ [Next.js](https://vercel.com/solutions/nextjs) - for the core framework
- 🎨 [TailwindCSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) - for styling and animations
- 🔄 [TRPC](https://trpc.io/) - for back-end
- 📦 [Redis](https://redis.com/) - for fast data storage
- 🌐 [PlanetScale](https://planetscale.com/) - for database management
- 🧬 [Prisma](https://www.prisma.io/) - for database ORM
- 🕸️ [SocketIO](https://socket.io/) - for real-time events
- 🎬 [@pixi/react](https://reactpixi.org/) - for sprite animations

## Run it Yourself

To run the project on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/teddy-bersentes/ready-steady-bang.git
```

2. Install dependencies:

```bash
cd ready-steady-bang
yarn install
```

3. Create a `.env` file in the project root with the following environment variables:

```makefile
REDIS_URL=your_redis_url
DB_URL=your_database_url
```

4. Run the development server:

```bash
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000` to see the game in action.

## Contributing

We welcome and appreciate contributions from the community! If you're interested in improving Ready Steady Bang Online or have ideas for new features, please feel free to submit a pull request, create an issue, or share your thoughts.

- **Pull Requests**: For code changes, bug fixes, or feature additions, please submit a pull request. Make sure to provide a clear description of the changes, and if possible, link it to a related issue.
- **Issues**: If you find a bug, have a suggestion, or want to request a new feature, please create an issue. Provide as much information as possible to help us understand and address your concerns.
- **Ideas**: If you have ideas for improving the game or want to share your thoughts on potential enhancements, we'd love to hear from you! Feel free to open an issue or start a discussion on the repository.

