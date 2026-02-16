import { Form, Input, Modal } from 'antd';

export const getPdfPassword = () => {
  return new Promise<string>((resolve, reject) => {
    let password = '';

    Modal.confirm({
      title: 'Password Protected PDF',
      icon: null,
      centered: true,
      content: (
        <div>
          <Form layout="vertical">
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'PDF password required' }]}>
              <Input.Password
                value={password}
                onChange={(e) => (password = e.target.value)}
                placeholder="Enter PDF password"
              />
            </Form.Item>
          </Form>
        </div>
      ),
      okText: 'Submit',
      onOk: () => resolve(password),
      onCancel: () => reject(new Error('User cancelled password entry')),
    });
  });
};
