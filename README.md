
# Amazon Seller Central Clone (React + TypeScript)

This project is a high-fidelity clone of the Amazon Seller Central (US Market) backend, built with React 18, TypeScript, Tailwind CSS, TanStack Query, and Zustand. It replicates core features such as a complex multi-step auth flow, marketplace switching, localized dashboards, and data import/export capabilities.

## 🚀 Quick Start

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## 🛠 Tech Stack

- **React 18**: Frontend library.
- **TypeScript**: Static typing for robust code.
- **Tailwind CSS**: Utility-first CSS for pixel-perfect design.
- **Zustand**: State management with persistence support.
- **TanStack Query (React Query)**: Server state management for reliable data synchronization.
- **Lucide React**: Clean vector icon library.
- **Recharts**: Responsive chart visualization.

## 📊 How to Import Test Data

1.  Navigate to the **Dashboard** or **Dev Data** page.
2.  In the **Dev Data** section, click **"Export Current State"** to download a JSON template of the current application state.
3.  Modify the JSON file (e.g., change `salesToday`, add items to `inventory`, or edit `openOrders`).
4.  Click **"Import JSON / CSV"** and select your modified file.
5.  The UI will immediately reflect the new data, and the state will be persisted in your local storage.

## 📂 Project Highlights

- **Multi-step Auth**: Pixel-perfect replication of the Sign-In, Password, and Two-Step Verification flows.
- **Marketplace Logic**: Switching marketplaces adjusts currency symbols and scales mock data figures (JPY, EUR, USD).
- **Sub-menu Navigation**: Implements an overflow logic for many menu items, ensuring responsiveness on smaller screens.
- **Pixel Density**: Fine-tuned compact UI mimicking the information-dense layout of professional merchant dashboards.

---
*Disclaimer: This project is for educational and portfolio demonstration purposes only and is not affiliated with Amazon.*
