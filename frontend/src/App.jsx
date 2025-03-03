import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "./Components/layout/Layout"
import { HomePage } from "./pages/HomePage.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { SignIn } from "./pages/SignIn.jsx"

function App() {

  return (
    <div className="font-poppins">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/signin" element={<SignIn />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

// Header can be fixed in app but then we will not get different layout for different page