import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useValidation } from 'react-simple-form-validator';

export default function NewLokasi() {
    const [nama, setNama] = useState('');
    const [alamat, setAlamat] = useState('');
    const [url, setUrl] = useState('');

    const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
        fieldsRules: {
            nama: { required: true },
            alamat: { required: true },
        },
        state: { nama, alamat },
    });


    const renderNamaErrors = () => {
        if (isFieldInError('nama')) {
            return getErrorsInField('nama').map((errorMessage, index) => (
                <Text key={index} style={styles.errorText} >
                    {errorMessage}
                </Text>
            ));
        }
        return null;
    };

    const renderAlamatErrors = () => {
        if (isFieldInError('alamat')) {
            return getErrorsInField('alamat').map((errorMessage, index) => (
                <Text key={index} style={styles.errorText} >
                    {errorMessage}
                </Text>
            ));
        }
        return null;
    };

    const renderPoster = () => {
        if (url != '') {
            return (
                <Image
                    style={{ width: 300, height: 400 }
                    }
                    resizeMode="contain"
                    source={{ uri: url }
                    }
                />
            );

        }
        return null;
    };

    const submitData = () => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "nama=" + nama + "&" +
                "alamat=" + alamat + "&" +
                "url=" + url
        };
        try {
            fetch('https://ubaya.cloud/react/160422173/newlokasi.php',
                options)
                .then(response => response.json())
                .then(resjson => {
                    console.log(resjson);
                    if (resjson.result === 'success') alert('sukses')
                });
        } catch (error) {
            console.log(error);
        }
    }

    const renderButtonSubmit = () => {
        if (isFormValid) {
            return (
                <Button title="Submit" onPress={submitData} />
            );
        }
        return null;
    };


    return (
        <>
            <Stack.Screen options={{ title: "Tambahkan Cabang Baru" }} />
            <ScrollView style={styles.container} >
                <Text>Nama </Text>
                < TextInput
                    style={styles.input}
                    onChangeText={setNama}
                    value={nama}
                />
                {renderNamaErrors()}

                < Text >Alamat </Text>
                < TextInput
                    multiline
                    numberOfLines={4}
                    style={styles.input2}
                    onChangeText={setAlamat} />
                {renderAlamatErrors()}

                < Text >Url </Text>
                < TextInput

                    style={styles.input}
                    onChangeText={setUrl}
                    value={url} />

                {renderPoster()}
                {renderButtonSubmit()}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    input2: {
        height: 140,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});