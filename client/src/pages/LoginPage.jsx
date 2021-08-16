import { Button, Checkbox, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { TOKEN_USER } from '../contants/token';
import HttpClient from '../utils/HttpClient';
const LoginPage = () => {
  const history = useHistory();
  const onFinish = (values) => {
    console.log('Success:', values);
    HttpClient.post('/auth/login',{
      ...values
    }).then((result)=> {
      localStorage.setItem(TOKEN_USER, result.data.accessToken);
      history.push("/");
    }).catch(error=>{
      message.error(error.message || 'Create account failed');
      console.error(error);
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem(TOKEN_USER);
    if(accessToken){
      history.push('/');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='centered'>
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
            Login
          </Button>
          <Link style={{
            marginLeft: 10
          }} to="/register">
            Register
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
