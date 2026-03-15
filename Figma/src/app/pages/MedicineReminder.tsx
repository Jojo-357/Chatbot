import { useState } from "react";
import { Plus, Trash2, Clock, Pill, Calendar, Bell } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate: string;
  notes: string;
}

export function MedicineReminder() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      time: ["08:00", "14:00", "20:00"],
      startDate: "2026-03-10",
      endDate: "2026-03-17",
      notes: "Take with food",
    },
    {
      id: "2",
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Once daily",
      time: ["09:00"],
      startDate: "2026-03-01",
      endDate: "2026-06-01",
      notes: "Take in the morning",
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    time: [""],
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.time[0]) {
      alert("Please fill in required fields: Medicine name, dosage, and time");
      return;
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      frequency: newMedicine.frequency,
      time: newMedicine.time.filter((t) => t !== ""),
      startDate: newMedicine.startDate,
      endDate: newMedicine.endDate,
      notes: newMedicine.notes,
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine({
      name: "",
      dosage: "",
      frequency: "Once daily",
      time: [""],
      startDate: "",
      endDate: "",
      notes: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  const addTimeSlot = () => {
    setNewMedicine({
      ...newMedicine,
      time: [...newMedicine.time, ""],
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...newMedicine.time];
    newTimes[index] = value;
    setNewMedicine({ ...newMedicine, time: newTimes });
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = newMedicine.time.filter((_, i) => i !== index);
    setNewMedicine({ ...newMedicine, time: newTimes });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Medicine Reminder
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Never miss a dose with personalized medication reminders
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      {/* Add Medicine Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Medicine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                placeholder="e.g., Aspirin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                placeholder="e.g., 100mg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={newMedicine.frequency}
                onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>3 times daily</option>
                <option>4 times daily</option>
                <option>As needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={newMedicine.startDate}
                onChange={(e) => setNewMedicine({ ...newMedicine, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={newMedicine.endDate}
                onChange={(e) => setNewMedicine({ ...newMedicine, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time(s) *
              </label>
              <div className="space-y-2">
                {newMedicine.time.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {newMedicine.time.length > 1 && (
                      <button
                        onClick={() => removeTimeSlot(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addTimeSlot}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add another time
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={newMedicine.notes}
                onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                placeholder="e.g., Take with food, avoid dairy"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddMedicine}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all font-semibold"
            >
              Save Medicine
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Medicine List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Medications</h2>
        {medicines.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No medications added yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Click "Add Medicine" to set up your first reminder
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">{medicine.dosage}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMedicine(medicine.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{medicine.frequency}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {medicine.time.map((time, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {time}
                      </span>
                    ))}
                  </div>

                  {(medicine.startDate || medicine.endDate) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {medicine.startDate && new Date(medicine.startDate).toLocaleDateString()}
                        {medicine.startDate && medicine.endDate && " - "}
                        {medicine.endDate && new Date(medicine.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {medicine.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{medicine.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-cyan-900 mb-2">Reminder Tips</h3>
        <ul className="space-y-2 text-sm text-cyan-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>Enable browser notifications to receive timely reminders</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>Set alarms on your phone as a backup reminder system</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>Keep your medications in a visible location to help you remember</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
            <span>Consult your doctor if you frequently miss doses or experience side effects</span>
          </li>
        </ul>
      </div>
    </div>
  );
}