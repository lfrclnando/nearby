import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

import { api } from "@/services/api";
import { colors, fontFamily } from "@/styles/theme";

import { Places } from "@/components/places";
import type { PlaceProps } from "@/components/place";
import { Categories, CategoriesProps } from "@/components/categories";

type MarketsProps = PlaceProps & {
  latitude: number
  longitude: number
}

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494
}

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([])
  const [category, setCategory] = useState("")
  const [markets, setMarkets] = useState<MarketsProps[]>([])

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories")
      setCategories(data)
      setCategory(data[0].id)
    } catch (error) {
      console.log(error)
      Alert.alert("Categorias", "Não foi possível carregar as categorias.")
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) { return } 

      const { data } = await api.get("/markets/category/" + category)
      setMarkets(data)
    } catch (error) {
      console.log(error)
      Alert.alert("Locais", "Não foi possível carregar os locais.")
    }
  }

  /**
   * Função responsável por pegar
   * a localização do usuário
   */
  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync()

      if (granted) {
        const location = await Location.getCurrentPositionAsync()
        console.log(location)
      }
    } catch (error) {
     console.log(error) 
    }
  }

  useEffect(() => {
    // getCurrentLocation() - caso eu queira colocar a localização de meu dispositivo
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchMarkets()
  }, [category])

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
      <Categories 
        data={categories} 
        onSelect={setCategory} 
        selected={category} 
      />

      <MapView style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker 
          identifier="current"
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          image={require("@/assets/location.png")}
        />
        {markets.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require("@/assets/pin.png")}
            >
              <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                <Text 
                style={{
                  fontSize: 14, 
                  fontFamily: fontFamily.medium, 
                  color: colors.gray[600]
                }}>
                  {item.name}
                </Text>
                
                <Text style={{
                  fontSize: 12,
                  fontFamily: fontFamily.regular,
                  color: colors.gray[600]
                }}>
                  {item.address}
                </Text>
              </Callout>
            </Marker>
        ))}
      </MapView>

      <Places data={markets} />
    </View>
  )
}