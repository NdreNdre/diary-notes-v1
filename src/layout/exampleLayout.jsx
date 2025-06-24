import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      <header>Dashboard Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
};

export default DashboardLayout;

// USAGE

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import DashboardLayout from "./layouts/DashboardLayout";
// import DashboardPage from "./pages/DashboardPage";

// const App = () => (
//   <Router>
//     <Routes>
//       <Route path="/dashboard" element={<DashboardLayout />}>
//         <Route index element={<DashboardPage />} />
//       </Route>
//     </Routes>
//   </Router>
// );

// export default App;
