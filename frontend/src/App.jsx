import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "./Components/layout/Layout"
import { HomePage } from "./pages/HomePage.jsx"
function App() {

  return (
    <div className="font-poppins">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />} >
            <Route path="/" element={<HomePage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

// Header can be fixed in app but then we will not get different layout for different page