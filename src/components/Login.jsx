import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        // Xử lý đăng nhập
        console.log('Đăng nhập với:', { username, password });
        Alert.alert('Đăng nhập', `Tên: ${username} - Mật khẩu: ${password}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Tên đăng nhập:</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Nhập tên đăng nhập"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Mật khẩu:</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Nhập mật khẩu"
                    secureTextEntry
                />
            </View>

            <Button title="Đăng Nhập" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 4,
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
});

export default Login;
