import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, DatePicker, Modal, message, Card, Select } from "antd";
import { db } from "./firebase-config";
import { collection, addDoc, getDocs, updateDoc, doc, query } from "firebase/firestore";
import "./FieldDetail.css";
import { PiPlantDuotone } from "react-icons/pi";

const { Option } = Select;

const CropView = () => {
  const { fieldId } = useParams();
  const [form] = Form.useForm();
  const [blendForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBlendModalVisible, setIsBlendModalVisible] = useState(false);
  const [isEditBlendModalVisible, setIsEditBlendModalVisible] = useState(false);
  const [crops, setCrops] = useState([]);
  const [blends, setBlends] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedBlend, setSelectedBlend] = useState(null);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const showBlendModal = (crop) => {
    setSelectedCrop(crop);
    setIsBlendModalVisible(true);
  };
  const handleBlendCancel = () => setIsBlendModalVisible(false);
  const showEditBlendModal = (blend) => {
    setSelectedBlend(blend);
    blendForm.setFieldsValue(blend);
    setIsEditBlendModalVisible(true);
  };
  const handleEditBlendCancel = () => setIsEditBlendModalVisible(false);

  const fetchCrops = async () => {
    const q = query(collection(db, "fields", fieldId, "crops"));
    const querySnapshot = await getDocs(q);
    const fetchedCrops = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let plantingDate;
      if (data.plantingDate && typeof data.plantingDate.toDate === "function") {
        plantingDate = data.plantingDate.toDate().toISOString().substring(0, 10);
      } else if (typeof data.plantingDate === "string") {
        plantingDate = data.plantingDate;
      } else {
        plantingDate = "Unknown";
      }
      return { id: doc.id, ...data, plantingDate };
    });
    setCrops(fetchedCrops);
  };

  const fetchBlends = async () => {
    const q = query(collection(db, "fields", fieldId, "blends"));
    const querySnapshot = await getDocs(q);
    const fetchedBlends = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlends(fetchedBlends);
  };

  useEffect(() => {
    fetchCrops();
    fetchBlends();
  }, [fieldId]);

  const onFinish = async (values) => {
    try {
      const cropsCollectionRef = collection(db, "fields", fieldId, "crops");
      const formattedValues = {
        ...values,
        plantingDate: values.plantingDate ? values.plantingDate.format("YYYY-MM-DD") : null,
      };
      await addDoc(cropsCollectionRef, formattedValues);
      fetchCrops();
      setIsModalVisible(false);
      form.resetFields();
      message.success("Crop details added successfully!");
    } catch (error) {
      console.error("Error adding crop: ", error);
      message.error("Failed to add crop details!");
    }
  };

  const handleCreateBlend = async (values) => {
    const { previousYield, yieldGoal, om } = values;
    const uptakeRates = integratedCalculation(previousYield, yieldGoal, om);

    const blendData = {
      ...values,
      cropId: selectedCrop.id,
      N: uptakeRates.N.toFixed(2),
      P2O5: uptakeRates.P2O5.toFixed(2),
      K2O: uptakeRates.K2O.toFixed(2),
      S: uptakeRates.S.toFixed(2),
      status: "draft",
    };

    try {
      const blendsCollectionRef = collection(db, "fields", fieldId, "blends");
      const docRef = await addDoc(blendsCollectionRef, blendData);
      console.log("Blend saved as draft with ID: ", docRef.id);
      fetchBlends();
      setIsBlendModalVisible(false);
      message.success("Blend saved as draft successfully!");
    } catch (error) {
      console.error("Error adding blend: ", error);
      message.error("Failed to save blend as draft!");
    }
  };

  const handleEditBlend = async (values) => {
    try {
      const blendRef = doc(db, "fields", fieldId, "blends", selectedBlend.id);
      await updateDoc(blendRef, values);
      fetchBlends();
      setIsEditBlendModalVisible(false);
      message.success("Blend details updated successfully!");
    } catch (error) {
      console.error("Error updating blend: ", error);
      message.error("Failed to update blend details!");
    }
  };

  const handlePublishBlend = async (blendId) => {
    try {
      await updateDoc(doc(db, "fields", fieldId, "blends", blendId), { status: "published" });
      fetchBlends();
      message.success("Blend published successfully!");
    } catch (error) {
      console.error("Error publishing blend: ", error);
      message.error("Failed to publish blend!");
    }
  };

  return (
    <div>
      <div className="add-crop-container">
        <Button onClick={showModal} className="add-crop-btn">Add Crop</Button>
      </div>

      <Modal title="Add Crop Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="cropName" label="Crop Name" rules={[{ required: true, message: "Please input the crop name!" }]}>
            <Input placeholder="E.g., Wheat" />
          </Form.Item>
          <Form.Item name="plantingDate" label="Planting Date" rules={[{ required: true, message: "Please select the planting date!" }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="fertilizer" label="Fertilizer Used">
            <Input placeholder="E.g., Nitrogen-based" />
          </Form.Item>
          <Form.Item name="cropProtection" label="Crop Protection Details">
            <Input.TextArea rows={4} placeholder="Details about crop protection measures" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Crop Details</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Add Blend Details" visible={isBlendModalVisible} onCancel={handleBlendCancel} footer={null}>
        <Form form={blendForm} layout="vertical" onFinish={handleCreateBlend}>
          <Form.Item name="previousYield" label="Previous Yield (bushels/acre)" rules={[{ required: true, message: "Please input the previous yield!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="yieldGoal" label="Yield Goal (bushels/acre)" rules={[{ required: true, message: "Please input the yield goal!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="om" label="Soil Organic Matter (%)" rules={[{ required: true, message: "Please input the soil organic matter!" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save Blend</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Edit Blend Details" visible={isEditBlendModalVisible} onCancel={handleEditBlendCancel} footer={null}>
        <Form form={blendForm} layout="vertical" onFinish={handleEditBlend}>
          <Form.Item name="N" label="Nitrogen (N)" rules={[{ required: true, message: "Please input the nitrogen amount!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="P2O5" label="Phosphorus (P2O5)" rules={[{ required: true, message: "Please input the phosphorus amount!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="K2O" label="Potassium (K2O)" rules={[{ required: true, message: "Please input the potassium amount!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="S" label="Sulfur (S)" rules={[{ required: true, message: "Please input the sulfur amount!" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Update Blend</Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="crops-container">
        {crops.map((crop) => {
          const cropBlend = blends.find(blend => blend.cropId === crop.id);
          return (
            <Card key={crop.id}>
              <div className="field-title">
                <h2>{crop.cropName}</h2>
                <div className="custom-icon">
                  <PiPlantDuotone />
                </div>
              </div>
              <p>Planting Date: {crop.plantingDate}</p>
              <p>Fertilizer Used: {crop.fertilizer}</p>
              <p>Crop Protection Details: {crop.cropProtection}</p>
              {cropBlend ? (
                <Button type="primary" onClick={() => showEditBlendModal(cropBlend)}>View Blend</Button>
              ) : (
                <Button type="primary" onClick={() => showBlendModal(crop)}>Add Blend</Button>
              )}
            </Card>
          );
        })}
      </div>

      <div className="blends-container">
        {blends.map((blend) => (
          <Card key={blend.id} title={`Blend for ${blend.cropId}`}>
            <p>Nitrogen (N): {blend.N}</p>
            <p>Phosphorus (P2O5): {blend.P2O5}</p>
            <p>Potassium (K2O): {blend.K2O}</p>
            <p>Sulfur (S): {blend.S}</p>
            <p>Status: {blend.status}</p>
            <Button onClick={() => showEditBlendModal(blend)}>Edit</Button>
            {blend.status === "draft" && (
              <Button onClick={() => handlePublishBlend(blend.id)}>Publish</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CropView;

// Function to calculate nutrient removal based on last year's yield
function calculateNutrientRemoval(previousYield) {
  const removalRatesPerBushel = {
    N: 1.87,
    P2O5: 0.78,
    K2O: 0.38,
    S: 0.22,
  };

  const removalRates = {};
  for (const nutrient in removalRatesPerBushel) {
    removalRates[nutrient] = previousYield * removalRatesPerBushel[nutrient];
  }

  return removalRates;
}

// Function to calculate nutrient uptake based on yield goal
function calculateNutrientUptake(yieldGoal) {
  const uptakePerBushel = {
    N: 2.38,
    P2O5: 0.90,
    K2O: 2.93,
    S: 0.86,
  };

  const uptakeRates = {};
  for (const nutrient in uptakePerBushel) {
    uptakeRates[nutrient] = yieldGoal * uptakePerBushel[nutrient];
  }

  return uptakeRates;
}

// Integrated calculation function that includes Soil Organic Matter (OM) contribution
function integratedCalculation(previousYield, yieldGoal, OM) {
  const soilOMContributionN = OM * 14 * 0.8;
  const removalRates = calculateNutrientRemoval(previousYield);
  const uptakeRates = calculateNutrientUptake(yieldGoal);
  uptakeRates['N'] = uptakeRates['N'] + soilOMContributionN;

  return uptakeRates;
}
