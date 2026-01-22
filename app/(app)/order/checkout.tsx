import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Alert, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // WAJIB ADA

// =================================================================
// 🔗 KONFIGURASI API (SESUAI SERVER UBAYA)
// =================================================================
const API_BASE = "https://ubaya.cloud/react/160422173"; 
// =================================================================

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State
  const [loading, setLoading] = useState(false);
  const [checkingSaldo, setCheckingSaldo] = useState(true);
  
  // Data User (Dinamis dari Login)
  const [userId, setUserId] = useState(""); 
  const [userSaldo, setUserSaldo] = useState(0); 
  const [userName, setUserName] = useState("");

  // Parsing Data Kursi
  let selectedSeats = [];
  try {
    selectedSeats = params.seats ? JSON.parse(params.seats as string) : [];
  } catch (e) { selectedSeats = []; }

  const scheduleId = parseInt(params.schedule_id as string);
  const studioName = params.studio_name || "Studio";
  const totalPrice = parseInt(params.total_ticket_price as string) || 0;

  // --- 1. AMBIL DATA USER DARI SESSION (AsyncStorage) ---
  useFocusEffect(
    useCallback(() => {
      checkSessionAndSaldo();
    }, [])
  );

  const checkSessionAndSaldo = async () => {
    setCheckingSaldo(true);
    try {
        // Ambil username yang disimpan saat Login
        // Pastikan key-nya sesuai dengan file Login.tsx kamu (biasanya 'username' atau 'user_id')
        const sessionUser = await AsyncStorage.getItem('username'); 

        if (!sessionUser) {
            Alert.alert("Error", "Sesi habis. Silakan login ulang.", [
                { text: "OK", onPress: () => router.replace("/") }
            ]);
            return;
        }

        setUserId(sessionUser); // Simpan ID ke state
        
        // Langsung cek saldo ke API Ubaya
        await fetchSaldo(sessionUser);

    } catch (error) {
        console.error("Session Error:", error);
    } finally {
        setCheckingSaldo(false);
    }
  };

  // --- 2. FUNGSI CEK SALDO KE SERVER UBAYA ---
  const fetchSaldo = async (activeUser: any) => {
    try {
        const url = `${API_BASE}/get_user.php?user_id=${activeUser}&t=${new Date().getTime()}`;
        console.log("Cek Saldo URL:", url);

        const response = await fetch(url);
        const json = await response.json();

        if (json.status === "success") {
            setUserSaldo(parseInt(json.data.saldo));
            setUserName(json.data.nama);
        } else {
            console.log("Gagal ambil saldo:", json.message);
        }
    } catch (error) {
        console.error("Network Error:", error);
        Alert.alert("Koneksi Gagal", "Gagal menghubungi server Ubaya.");
    }
  };

  const isSaldoCukup = userSaldo >= totalPrice;

  // --- 3. PROSES PEMBAYARAN ---
  const handlePay = async () => {
    if (!userId) return; // Penjagaan ganda

    setLoading(true);
    try {
      const payload = {
        user_id: userId, // Pakai ID asli yang sedang login
        schedule_id: scheduleId,
        seats: selectedSeats,
        total_bayar: totalPrice
      };

      console.log("Mengirim Payment:", payload);

      const response = await fetch(`${API_BASE}/process_payment.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "success") {
        Alert.alert("Pembayaran Berhasil!", "Tiket Anda telah tersimpan.", [
            { 
                text: "OK", 
                onPress: () => {
                    // Kembali ke Home
                    while (router.canGoBack()) { router.back(); }
                    router.replace("/"); 
                } 
            }
        ]);
      } else {
        Alert.alert("Gagal", result.message);
        // Refresh saldo in case ada perubahan
        fetchSaldo(userId); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Review Pesanan</Text>
      
      {/* KARTU DETAIL FILM */}
      <View style={styles.card}>
        <Text style={styles.label}>Studio</Text>
        <Text style={styles.value}>{studioName}</Text>

        <Text style={styles.label}>Kursi Dipilih</Text>
        <Text style={styles.value}>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Tagihan</Text>
          <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString("id-ID")}</Text>
        </View>
      </View>

      {/* KARTU SALDO & USER */}
      <View style={[styles.card, { marginTop: 20 }]}>
        <Text style={styles.label}>Pembayaran atas nama:</Text>
        <Text style={[styles.value, {marginBottom: 5}]}>{userName || userId || "Loading..."}</Text>
        
        <View style={styles.divider} />

        <Text style={styles.label}>Metode Pembayaran: Saldo Akun</Text>
        
        {checkingSaldo ? (
             <ActivityIndicator size="small" color="#3f35f8" style={{alignSelf:'flex-start', marginVertical: 10}} />
        ) : (
            <View>
                <View style={styles.row}>
                  <Text style={{fontSize: 16}}>Sisa Saldo Anda:</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#333' }}>
                    Rp {userSaldo.toLocaleString("id-ID")}
                  </Text>
                </View>

                {!isSaldoCukup && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                      ⚠️ Saldo Tidak Cukup
                    </Text>
                    <Text style={{color: 'red', fontSize: 12}}>
                      Kurang Rp {(totalPrice - userSaldo).toLocaleString("id-ID")}
                    </Text>
                  </View>
                )}
            </View>
        )}
      </View>

      {/* TOMBOL BAYAR */}
      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.btnPay, 
            (!isSaldoCukup || loading || checkingSaldo) && styles.btnDisabled
          ]}
          onPress={handlePay}
          disabled={!isSaldoCukup || loading || checkingSaldo}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              {checkingSaldo ? "Memuat Data..." : (isSaldoCukup ? "Bayar Sekarang" : "Top Up Dulu")}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F8F9FA' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', marginTop: 10 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  label: { color: 'gray', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 16, fontWeight: '600', marginBottom: 15, color: '#222' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#444' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#3f35f8' },
  errorBox: { marginTop: 15, padding: 10, backgroundColor: '#ffe6e6', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: 'red' },
  errorText: { color: 'red', fontWeight: 'bold', fontSize: 14 },
  footer: { marginTop: 30 },
  btnPay: { backgroundColor: '#3f35f8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: "#3f35f8", shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  btnDisabled: { backgroundColor: '#ccc', shadowOpacity: 0, elevation: 0 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});