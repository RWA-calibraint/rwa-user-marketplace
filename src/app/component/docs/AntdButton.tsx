import { Button } from 'antd';

function AntdButtonsDoc() {
  return (
    <div className="d-flex p-y-32 w-full align-center justify-center flex-column">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Primary Button */}
        <Button type="primary">Primary Button</Button>

        {/* Primary Disabled */}
        <Button type="primary" disabled>
          Primary Disabled
        </Button>

        {/* Secondary / Default Button */}
        <Button type="default">Secondary Button</Button>

        {/* Secondary Disabled */}
        <Button type="default" disabled>
          Secondary Disabled
        </Button>

        {/* Danger / Error Button */}
        <Button danger>Danger Button</Button>

        {/* Danger Disabled */}
        <Button danger disabled>
          Danger Disabled
        </Button>

        {/* Outline Button */}
        <Button type="default" className="ant-btn-outlined">
          Outline Button
        </Button>

        {/* Outline Disabled */}
        <Button type="default" className="ant-btn-outlined" disabled>
          Outline Disabled
        </Button>

        {/* Text Button */}
        <Button type="text">Text Button</Button>

        {/* Text Disabled */}
        <Button type="text" disabled>
          Text Disabled
        </Button>

        {/* Large Primary Button */}
        <Button type="primary" size="large">
          Large Primary
        </Button>

        {/* Large Secondary Button */}
        <Button type="default" size="large">
          Large Secondary
        </Button>

        {/* Icon Button Example */}
        <Button type="primary" icon={<span>🚀</span>}>
          Icon Button
        </Button>
      </div>
    </div>
  );
}

export default AntdButtonsDoc;
