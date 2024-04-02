import React, { useEffect } from "react"; // Fix 1: Add useEffect here
import { Form, Input, Button, Checkbox, Modal } from "antd";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config"; // Fix 2: Ensure auth is imported correctly
import { useAuth } from "./context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import logoImg from "./logo.png";

const Login = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const onFinish = async (values) => {
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, values.username, values.password);
      navigate("/dashboard"); // Navigate on successful login
    } catch (error) {
      console.error("Login Failed:", error.message);
      Modal.error({
        title: "Login Failed",
        content: "The username or password you entered is incorrect.",
      }); // Here you can set an error state and show it to the user
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="login-form"
      >
        <img src={logoImg} alt="Logo" className="login-logo" />
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
