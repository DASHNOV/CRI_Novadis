import React from 'react';
import FormInput from './FormInput';

const FormTextArea = (props) => {
    return (
        <FormInput
            {...props}
            multiline={true}
            numberOfLines={props.rows || 4}
        />
    );
};

export default FormTextArea;
