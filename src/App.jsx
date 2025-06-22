import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import ResetPassword from "./pages/ResetPasswordPage/ResetPasswordPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage/ResetPasswordConfirmPage";
import ActivateAccountPage from "./pages/ActivateAccountPage/ActivateAccountPage";



function App() {
  const Layout = () => {
    return (

      <div className="app">

        <Navbar />
        <Outlet />
        <Footer />

      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs/:title",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },

        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/resetPassword",
          element: <ResetPassword />,
        },
        {
          path: "/password/reset/confirm/:uid/:token",
          element: <ResetPasswordConfirmPage />,
        },
        {
          path: "/activate/:uid/:token",
          element: <ActivateAccountPage />,
        },
      ],
    },

  ]);

  return <RouterProvider router={router} />;
}

export default App;
