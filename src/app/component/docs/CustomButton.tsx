function CustomButtonsDoc() {
  return (
    <div className="d-flex p-y-32 w-full align-center justify-center flex-column">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="btn btn-primary-default ">Primary Default</button>
        <button className="btn btn-primary-outline ">Primary Outline</button>
        <button className="btn btn-primary-text ">Primary Text</button>

        <button className="btn btn-secondary-default ">Secondary Default</button>
        <button className="btn btn-secondary-outline ">Secondary Outline</button>
        <button className="btn btn-secondary-text ">Secondary Text</button>

        <button className="btn btn-error-default ">Error Default</button>
        <button className="btn btn-error-outline ">Error Outline</button>
        <button className="btn btn-error-text ">Error Text</button>

        <button className="btn btn-secondary-default lg">Secondary Default Large</button>
        <button className="btn btn-secondary-outline lg">Secondary Outline Large</button>
        <button className="btn btn-secondary-text lg">Secondary Text Large</button>

        <button className="btn btn-error-default lg">Error Default Large</button>
        <button className="btn btn-error-outline lg">Error Outline Large</button>
        <button className="btn btn-error-text lg">Error Text Large</button>

        <button className="btn btn-primary-default lg">Primary Default Large</button>
        <button className="btn btn-primary-outline lg">Primary Outline Large</button>
        <button className="btn btn-primary-text lg">Primary Text Large</button>

        <button className="btn btn-primary-default  disabled">Primary Disabled</button>
        <button className="btn btn-secondary-outline lg disabled">Secondary Outline Disabled</button>
        <button className="btn btn-error-text  disabled">Error Text Disabled</button>
        <button className="btn btn-error-text">Error Text Disabled</button>
      </div>
    </div>
  );
}

export default CustomButtonsDoc;
