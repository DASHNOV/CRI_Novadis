import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const FormDatePicker = ({ label, value, onChange, mode = 'date', required, error }) => {
    const [show, setShow] = useState(false);

    const formatDate = (date, mode) => {
        if (!date) return '';
        if (mode === 'time') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString();
    };

    const handleChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>

            <TouchableOpacity
                style={[styles.input, error && styles.inputError]}
                onPress={() => setShow(true)}
            >
                <Text style={value ? styles.text : styles.placeholder}>
                    {value ? formatDate(value, mode) : `Sélectionner ${mode === 'time' ? 'une heure' : 'une date'}`}
                </Text>
                <Ionicons
                    name={mode === 'time' ? "time-outline" : "calendar-outline"}
                    size={24}
                    color={COLORS.gray}
                />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={handleChange}
                />
            )}

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        color: COLORS.black,
    },
    placeholder: {
        color: COLORS.gray,
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

export default FormDatePicker;
