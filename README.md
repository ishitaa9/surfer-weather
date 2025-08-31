🌊 Why Surfer Weather?

Because checking wind, waves, and weather shouldn’t be complicated —
everything surfers need, at a glance. 🏄‍♀️


## 🚀 Features

- 🌍 **Search**: Autocomplete surf spots across **Germany** (via Open-Meteo Geocoding API).
- 🌊 **Marine Forecast**: Wave height, wave period, swell, and wind-wave data.
- 🌦️ **Daily Weather**: Temperature, rain, wind speed/gusts, UV index, and weather icons.
- 🎚️ **Surf Score**: 0–100 score calculated from **wave height**, **period**, and **wind speed**.
- 🏆 **Best Day Badge**: Highlights the **best surf day** when the score ≥ **55**.
- 📊 **24-Hour Charts**: Interactive wind & wave previews via **Recharts**.
- 🌗 **Dark Mode**: Respects your system preference automatically.
- ⚡ **Fast + Modern**: Powered by **Vite** for instant builds and blazing-fast HMR.

---

## 🛠️ Tech Stack

| Category        | Tech                                                  |
| -------------- | ----------------------------------------------------- |
| **Frontend**   | [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling**    | [TailwindCSS](https://tailwindcss.com/)               |
| **Charts**     | [Recharts](https://recharts.org/)                     |
| **Icons**      | [Lucide Icons](https://lucide.dev/)                   |
| **API**        | [Open-Meteo](https://open-meteo.com/) (Weather + Marine + Geocoding) |
| **Bundler**    | [Vite](https://vitejs.dev/)                           |

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/surfer-weather.git
cd surfer-weather
npm install
```

## 🏃‍♂️ Running the Project
Start the development server:
```bash
npm run dev
```
Then open http://localhost:5173 in your browser.

## 📦 Build for Production

```bash
npm run build
```

## 🔗 API Endpoints
Geocoding (Germany-only)
```bash
GET https://geocoding-api.open-meteo.com/v1/search?name=<query>&language=de&countryCode=DE&count=8
```
Weather Forecast
```bash
GET https://api.open-meteo.com/v1/forecast
```

Daily variables:

- Weather code, temperature max/min, UV index, rain, wind speed/gusts.

Hourly variables:

- wind_speed_10m, wind_gusts_10m.

Marine Forecast
```bash
GET https://marine-api.open-meteo.com/v1/marine
```

Daily variables:

- Wave height, period, swell, wind-wave data.

- cell_selection=sea ensures coastal accuracy.

Hourly variables:

- wave_height, wave_period.

Note: Open-Meteo is free and doesn’t require an API key.

## 🎚️ Surf Score Logic
```bash
score = waveHeight * 30 + period * 2 - wind * 0.8;
```
- ✅ Higher waves → better
- ✅ Longer periods → better
- ❌ Strong winds → worse
Best Day Badge appears only when the top score ≥ 55.

## 🚀 Roadmap
 ⭐ Save favorite surf spots
 🧭 Offshore / Onshore wind indicator
 📲 PWA support (installable app)
 🌙 Manual dark mode toggle
 🔔 “Best day” notification
 🤝 Contributing

## 🤝Contributions 
Contributions are welcome!
1. Fork the repo
2. Create your feature branch
```bash
git checkout -b feature/my-feature
```

Commit your changes
```bash
git commit -m "Add my feature"
```

Push
```bash
git push origin feature/my-feature
```
Open a pull request 🎉

## 🙌 Acknowledgements
- [Open-Meteo API](https://open-meteo.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
- [TailwindCSS](https://tailwindcss.com/)

##👩‍💻 Author

Ishita Gupta
- [GitHub](https://github.com/ishitaa9)
- [LinkedIn](https://www.linkedin.com/in/ishita-gupta-b887241a3/)
