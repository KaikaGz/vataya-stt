import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  redirect,
} from "react-router-dom";
import { route } from "./routes/routes";
import { AuthWrapper, useAuth } from "./utils/auth/AuthWrapper";

function App() {
  return (
    <>
      <Router basename="/stt">
        <AuthWrapper>
          <Routes>
            {route.map((d, ind) => {
              return (
                <Route key={ind} element={d.element} path={d.path}>
                  {d.children &&
                    d.children.map((chil, cind) => {
                      //   if (!!chil.access && chil.access == "Admin") {
                      return (
                        <Route
                          key={`${ind}` + `${cind}`}
                          element={chil.element}
                          path={chil.path}
                        ></Route>
                      );
                      //   }
                    })}
                </Route>
              );
            })}
          </Routes>
        </AuthWrapper>
      </Router>
    </>
  );
}

export default App;
