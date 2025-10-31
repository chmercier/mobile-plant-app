import {
  CameraView,
  useCameraPermissions,
  type CameraCapturedPicture,
} from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Header";
import colors from "../styles/colors";
import typography from "../styles/typography";

export type Plant = {
  uri: string;              // user photo
  name: string;             // common name
  watering?: string;
  sunlight?: string[];
  referenceImage?: string;  // Perenual reference image
};

export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [plantName, setPlantName] = useState("");
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();
  const API_KEY = "sk-AVDv6902471a8542913194";

  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
  }, []);

  if (!permission) return <View />;
  if (!permission.granted)
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.addButton}>
          <Text style={styles.addButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData: CameraCapturedPicture =
          await cameraRef.current.takePictureAsync();
        if (photoData?.uri) {
          setPhoto(photoData.uri);
          setCameraOpen(false);
          setNameModalVisible(true);
        }
      } 
      catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

const fetchPlantData = async (name: string) => {
  try {
    setLoading(true);

    const searchResponse = await fetch(
      `https://perenual.com/api/v2/species-list?key=${API_KEY}&q=${encodeURIComponent(name)}`
    );
    const text = await searchResponse.text(); // read raw text
    let searchData;

    try {
      searchData = JSON.parse(text);
    } catch {
      console.error("Invalid JSON:", text);
      Alert.alert("Error", "Invalid response from Perenual API. Check your API key or network.");
      setLoading(false);
      return null;
}

    if (!searchData.data || searchData.data.length === 0) {
      setLoading(false);
      Alert.alert("No data found", "Couldn't find this plant in Perenual.");
      return null;
    }

    const plantId = searchData.data[0].id;

    const detailsResponse = await fetch(
      `https://perenual.com/api/v2/species/details/${plantId}?key=${API_KEY}`
    );
    const detailsData = await detailsResponse.json();
    setLoading(false);

    return {
      watering: detailsData.watering ?? "Unknown",
      sunlight: detailsData.sunlight ?? ["Unknown"],
      referenceImage: detailsData.default_image?.medium_url ?? null,
    };
  } catch (err) {
    console.error("Error fetching plant data:", err);
    setLoading(false);
    Alert.alert("Error", "Failed to fetch plant data.");
    return null;
  }
};



  const savePlant = async () => {
    if (photo && plantName.trim()) {
      const details = await fetchPlantData(plantName.trim());
      const newPlant: Plant = {
        uri: photo,
        name: plantName.trim(),
        ...details,
      };
      setPlants((prev) => [...prev, newPlant]);
      setPhoto(null);
      setPlantName("");
      setNameModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Plants" />
      <View style={styles.content}>
        <Text style={typography.header}>Your Plant Collection</Text>
        <Text style={typography.body}>Take photos and name your plants.</Text>

        <FlatList
          data={plants}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.plantCard}
              onPress={() =>
                router.push({
                  pathname: "/plantsdetails",
                  params: { plant: JSON.stringify(item) },
                })
              }
            >
              <Image source={{ uri: item.uri }} style={styles.plantImage} />
              <Text style={styles.plantName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 20, color: colors.textSecondary }}>
              No plants yet — add one!
            </Text>
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCameraOpen(true)}
        >
          <Text style={styles.addButtonText}>
            {loading ? "Loading..." : "+ Add Plant"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      <Modal visible={cameraOpen} animationType="slide">
        <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        <View style={styles.cameraButtons}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureText}>📸 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={styles.captureText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Name Input Modal */}
      <Modal visible={nameModalVisible} transparent animationType="slide">
        <View style={styles.nameModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Name your plant</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Aloe Vera"
              value={plantName}
              onChangeText={setPlantName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={savePlant}>
              {loading ? (
                <ActivityIndicator color={colors.textOnDark} />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { flex: 1, padding: 20, alignItems: "center" },
  gallery: { marginTop: 20, alignItems: "center" },
  plantCard: { margin: 10, alignItems: "center" },
  plantImage: { width: 150, height: 150, borderRadius: 10 },
  plantName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: { color: colors.textOnDark, fontSize: 18 },
  camera: { flex: 1 },
  cameraButtons: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: colors.textOnDark,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
  },
  captureText: { fontSize: 16, color: colors.textPrimary },
  nameModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.textOnDark,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveText: { color: colors.textOnDark, fontSize: 18 },
});
