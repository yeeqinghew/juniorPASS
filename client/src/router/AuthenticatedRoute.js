import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";

// const AuthenticatedRoute = ({
//   component: C,
//   appProps,
//   props,
//   user,
//   ...rest
// }) => {
//   return (
//     <Routes>
//       <Route
//         {...rest}
//         loader={(props) => {
//           if (!appProps.isAuthenticated) {
//             if (props.loading) {
//               if (localStorage.length === 0) {
//                 // TODO: Error message prompt
//                 return <Navigate to="/login" />;
//               } else {
//                 console.error("ERROR: inAuthenticatedRoute");
//               }
//             }
//           }

//           if (props.loading) {
//             return (
//               <div>
//                 {/* TODO: make this spin a common component */}
//                 <Spin
//                   indicator={
//                     <LoadingOutlined
//                       style={{ fontSize: 100, textAlign: "center" }}
//                       spin
//                     />
//                   }
//                 ></Spin>
//               </div>
//             );
//           }

//           if (appProps.isAuthenticated) {
//             return <C {...props} {...appProps} />;
//           }
//         }}
//       />
//     </Routes>
//   );
// };

const AuthenticatedRoute = ({ isAuthenticated, loading }) => {
  if (!isAuthenticated && localStorage.length === 0) {
    // if (!isAuthenticated && loading && localStorage.length === 0) {
    return <Navigate to="/login" />;
  }

  //   if (loading) {
  //     return (
  //       <Spin
  //         indicator={
  //           <LoadingOutlined
  //             style={{ fontSize: 100, textAlign: "center" }}
  //             spin
  //           />
  //         }
  //       ></Spin>
  //     );
  //   }

  return <Outlet />;
};
export default AuthenticatedRoute;
