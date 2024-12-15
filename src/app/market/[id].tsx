import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { api } from "@/services/api";
import { useEffect } from "react";

export default function Market() {
  const params = useLocalSearchParams<{ id: string }>()

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`)
      console.log(data)
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível carregar os dados", [
        {
          text: "Ok",
          onPress: () => router.back(),
        },
      ])
    }
  }

  useEffect(() => {
    fetchMarket()
  },[params.id])

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{params.id}</Text>
    </View>
  );
}