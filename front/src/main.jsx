import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";

import Home from "./pages/Home";
import Blog from "./pages/blog/Blog";
import Article from "./pages/blog/Article";
import Gallery from "./pages/gallery/Gallery";
import Admin from "./pages/admin/Admin";
import AddArticle from "./pages/admin/article/Add";
import EditArticle from "./pages/admin/article/Edit";
import AddGallery from "./pages/admin/gallery/Add";
import EditGallery from "./pages/admin/gallery/Edit";
import AddUser from "./pages/admin/users/Add";
import EditUser from "./pages/admin/users/Edit";
import Header from "./pages/components/Header";
import Footer from "./pages/components/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header page={"home"} />
              <Home />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Header page={"blog"} />
              <Blog />
            </>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <>
              <Header page={"blog"} />
              <Article />
            </>
          }
        />
        <Route
          path="/galerie"
          element={
            <>
              <Header page={"galerie"} />
              <Gallery />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Header page={"admin"} />
              <Admin />
            </>
          }
        />
        <Route
          path="/admin/article/add"
          element={
            <>
              <Header page={"admin"} />
              <AddArticle />
            </>
          }
        />
        <Route
          path="/admin/article/edit/:id"
          element={
            <>
              <Header page={"admin"} />
              <EditArticle />
            </>
          }
        />
        <Route
          path="/admin/gallery/add"
          element={
            <>
              <Header page={"admin"} />
              <AddGallery />
            </>
          }
        />
        <Route
          path="/admin/gallery/edit/:id"
          element={
            <>
              <Header page={"admin"} />
              <EditGallery />
            </>
          }
        />
        <Route
          path="/admin/user/add"
          element={
            <>
              <Header page={"admin"} />
              <AddUser />
            </>
          }
        />
        <Route
          path="/admin/user/edit/:id"
          element={
            <>
              <Header page={"admin"} />
              <EditUser />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Header page={"404"} />
              <p>404 Not Found</p>
            </>
          }
        />
      </Routes>
    </Router>
    <Footer />
  </React.StrictMode>
);
