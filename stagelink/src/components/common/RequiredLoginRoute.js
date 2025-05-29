import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// 사용자가 로그인하지 않은 경우 /login으로 리다이렉트하는 컴포넌트
const RequireLoginRoute = ({ children }) => {
    const isLogin = useSelector((state) => state.login.isLogin);
    const location = useLocation();

    if (!isLogin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireLoginRoute;