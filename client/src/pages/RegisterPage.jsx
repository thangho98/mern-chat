import { Button, Checkbox, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import HttpClient from '../utils/HttpClient';
const RegisterPage = () => {
  const onFinish = (values) => {
    HttpClient.post('/auth/register', {
      ...values,
    })
      .then((result) => {
        message.success('Create account success');
      })
      .catch((error) => {
        message.error('Create account failed');
        console.error(error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  return (
    <div className="centered">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <Link
            style={{
              marginLeft: 10,
            }}
            to="/login"
          >
            Login
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
