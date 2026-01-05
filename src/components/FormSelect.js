import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../utils/constants';

const FormSelect = ({ label, value, onValueChange, options, required, error }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={[styles.pickerContainer, error && styles.inputError]}>
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Sélectionner..." value="" color={COLORS.gray} />
                    {options.map((option, index) => (
                        <Picker.Item key={index} label={option} value={option} color={COLORS.black} />
                    ))}
                </Picker>
            </View>
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
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

export default FormSelect;
