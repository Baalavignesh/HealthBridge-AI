# Cell 1: Import necessary libraries
import pandas as pd
import torch
from torch.utils.data import Dataset
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments,
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Cell 2: Load the synthetic dataset
df_train = pd.read_csv("D:\Hackthon\Train.csv\Train.csv")
df_train = df_train.drop(columns=["transcription"])
print(df_train.head())

# Create label encodings
specialties = df_train["medical_specialty"].unique().tolist()
specialty_to_id = {sp: idx for idx, sp in enumerate(specialties)}
id_to_specialty = {idx: sp for sp, idx in specialty_to_id.items()}

df_train["label"] = df_train["medical_specialty"].map(specialty_to_id)
print(df_train.head())


mapping = {
    "Surgery": "Surgeon",
    "Consult - History and Phy.": "Consultant Physician",
    "Cardiovascular / Pulmonary": "Cardiologist / Pulmonologist",
    "Orthopedic": "Orthopedic Surgeon",
    "Radiology": "Radiologist",
    "Gastroenterology": "Gastroenterologist",
    "General Medicine": "General Practitioner",
    "Neurology": "Neurologist",
    "SOAP / Chart / Progress Notes": "Medical Scribe",
    "ENT - Otolaryngology": "Otolaryngologist",
    "Discharge Summary": "Hospitalist",
    "Neurosurgery": "Neurosurgeon",
    "Hematology - Oncology": "Hematologist / Oncologist",
    "Nephrology": "Nephrologist",
    "Ophthalmology": "Ophthalmologist",
    "Pain Management": "Pain Specialist",
    "Podiatry": "Podiatrist",
    "Office Notes": "Office-based Physician",
    "Dermatology": "Dermatologist",
    "Psychiatry / Psychology": "Psychiatrist / Psychologist",
    "Dentistry": "Dentist",
    "Cosmetic / Plastic Surgery": "Plastic Surgeon",
    "Letters": "Medical Correspondent",
    "Sleep Medicine": "Sleep Medicine Specialist",
    "Lab Medicine - Pathology": "Pathologist",
    "Allergy / Immunology": "Allergist / Immunologist",
    "Autopsy": "Forensic Pathologist",
    "SCARF type": "SCARF Specialist"
}
mapping_lower = {key.lower(): value for key, value in mapping.items()}

df_train["doctor_occupation"] = df_train["medical_specialty"].str.strip().str.lower().map(mapping_lower)
df_train.head(20)
#df_train.to_csv("updated_train_data.csv", index=False)


# Cell 6: Load the trained DistilBERT model + tokenizer
model_path = "./doctor_specialty_model"

trained_model = DistilBertForSequenceClassification.from_pretrained(model_path)
trained_tokenizer = DistilBertTokenizerFast.from_pretrained(model_path)
trained_model.to(device)
trained_model.eval()

def predict_specialty(complaint_text):
    """
    Predict the medical specialty for the given complaint_text
    using the fine-tuned DistilBERT model.
    """
    inputs = trained_tokenizer(
        complaint_text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=128,
    )
    # Move inputs to GPU if available
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = trained_model(**inputs)
    logits = outputs.logits
    predicted_id = torch.argmax(logits, dim=1).item()
    predicted_specialty = id_to_specialty[predicted_id]
    return predicted_specialty

# Cell 7: Recommend doctors from the Fake_Doctors_DMV_Dataset.csv
def recommend_doctors(complaint_text, user_location, doctors_csv_path):
    """
    1) Predict the specialty from the complaint_text.
    2) Load the Fake_Doctors_DMV_Dataset.csv (which has extra features).
    3) Filter by specialty, location, insurance.
    4) Return or print the recommended rows, including extra features (experience, rating, etc.).
    """
    # Step 1: Predict specialty
    specialty = predict_specialty(complaint_text)
    print(f"Predicted Specialty: {specialty}")
    doctor_occupation = mapping.get(specialty.strip(), "Unknown")
    print(f"Corresponding Doctor Occupation: {doctor_occupation}")
    specialty_6 = specialty.strip().lower()[:6]
    try:
        df = pd.read_csv(doctors_csv_path)
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return pd.DataFrame()
    
    # Verify required columns exist
    required_columns = ["doctor_name", "medical_specialty","email", "phone_number", "hospital_name","hospital_state", "password"]
    for col in required_columns:
        if col not in df.columns:
            print(f"CSV is missing required column: {col}")
            return pd.DataFrame()
    # Match the specialty with medical_specialty and display the corresponding doctor_name, email, phone_number, state
    df_specialty_6 = df["medical_specialty"].str.strip().str.lower().str[:6]
    filtered_df = df[df_specialty_6 == specialty_6]

    user_loc_clean = user_location.strip().lower()
    filtered_df = filtered_df[
        (filtered_df["hospital_state"].str.strip().str.lower() == user_location.strip().lower())]
    
    # Output results
    if filtered_df.empty:
        print(f"No doctors found in state '{user_location}' with specialty '{specialty}'")
    else:
        print("Recommended Doctors:\n")
    return filtered_df

# Cell 8: Example usage of the entire pipeline
def entry_point():
    
    # Example user complaint
    complaint_text = "I tore my ACL while playing soccer and need surgery."
    
    # User location and insurance
    user_location = "maryland"
    
    
    # Path to your Fake_Doctors_DMV_Dataset.csv
    doctors_csv_path = "doctors.csv"

    
    # Get recommendations
    recommendations = recommend_doctors(complaint_text, user_location, doctors_csv_path)
    