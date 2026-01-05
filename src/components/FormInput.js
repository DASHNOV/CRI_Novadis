import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { COLORS } from '../utils/constants';

const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    required,
    error,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    multiline && styles.textarea
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: COLORS.darkGray,
        marginBottom: 5,
        fontWeight: '500',
    },
    required: {
        color: COLORS.error,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: COLORS.white,
        minHeight: 45,
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 5,
    },
});

export default FormInput;
