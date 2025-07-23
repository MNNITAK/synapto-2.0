const professors = [
    {
      name: "Prof. R. Tripathi",
      qualification: "Ph.D.",
      areaOfInterest: "Data Communication Engg., Wireless & Mobile Communications",
      phone: "+91-532-2271110(O)",
      email: "rt@mnnit.ac.in"
    },
    {
      name: "Prof. Haranath Kar",
      qualification: "Ph.D.",
      areaOfInterest: "Digital Signal Processing, Multidimensional Systems.",
      phone: "+91-532-2271455(O), +91-532-2271603(R)",
      email: "hnkar1@rediffmail.com, hnkar@mnnit.ac.in"
    },
    {
      name: "Prof. V.K. Srivastava",
      qualification: "Ph.D.",
      areaOfInterest: "Signal & Image Processing, Communication Systems.",
      phone: "+91-532-2271453(O), +91-532-2271911(R)",
      email: "vinay@mnnit.ac.in"
    },
    {
      name: "Prof. (Smt.) V. Bhadauria",
      qualification: "Ph.D.",
      areaOfInterest: "VLSI Design, Analog Circuit Design.",
      phone: "+91-532-2271457(O), +91-532-2271942(R)",
      email: "vijaya@mnnit.ac.in"
    },
    {
      name: "Prof. Amit Dhawan",
      qualification: "Ph.D.",
      areaOfInterest: "Digital Systems, Digital Signal Processing.",
      phone: "+91-532-2271454(O), +91-532-2271933(R)",
      email: "dhawan@mnnit.ac.in, amit_dhawan@rediffmail.com"
    },
    {
      name: "Prof. R.K. Nagaria",
      qualification: "Ph.D.",
      areaOfInterest: "Mixed-Mode Signal Processing, VLSI Circuits & Systems.",
      phone: "+91-532-2271464(O), +91-532-2271813(R)",
      email: "rkn@mnnit.ac.in, rknagaria@yahoo.co.uk"
    },
    {
      name: "Prof. R.A. Mishra",
      qualification: "Ph.D.",
      areaOfInterest: "1. Low Power VLSI Circuits,\n2. Modeling and Applications of Semiconductor Devices,\n3. Residue Number System based Circuits Design.",
      phone: "+91-532-2271461(O), +91-532-2271654(R)",
      email: "ramishra@mnnit.ac.in"
    },
    {
      name: "Prof. V.S. Tripathi",
      qualification: "Ph.D.",
      areaOfInterest: "RF Circuits and Systems, Antenna, SDR, Non-Invasive RF Sensors.",
      phone: "+91-532-2271450(O)",
      email: "vst@mnnit.ac.in"
    },
    {
      name: "Prof. Basant Kumar",
      qualification: "B. Tech. M.E. Ph.D. (IIT-BHU)",
      areaOfInterest: "Biomedical Signal & Image Processing, Digital Watermarking, Data Hiding, Telemedicine, Communication, Medical Instrumentation.",
      phone: "+91-532-2271468(O)",
      email: "singhbasant@mnnit.ac.in"
    },
    {
      name: "Prof. Yogendra Kumar Prajapati",
      qualification: "Ph.D.",
      areaOfInterest: "Optical Transmission, Plasmonic Sensors, Spin Hall Effect, Silicon Photonics.",
      phone: "+91-532-2271469(O)",
      email: "yogendrapra@mnnit.ac.in, yogendrapra@gmail.com"
    },
    {
      name: "Prof. Sanjeev Rai",
      qualification: "Ph.D.",
      areaOfInterest: "Microelectronics & VLSI Design, Modeling of Semiconductor Devices, VLSI Circuits & Systems.",
      phone: "+91-532-2271457(O)",
      email: "srai@mnnit.ac.in"
    },
    {
      name: "Prof. Arun Prakash",
      qualification: "Ph.D.",
      areaOfInterest: "Wireless & Mobile Communication, Sensor Networks, Cognitive Radio, ITS.",
      phone: "+91-532-2271468(O)",
      email: "arun@mnnit.ac.in"
    },
    {
      name: "Dr. V. Krishna Rao Kandanvli",
      qualification: "Ph.D.",
      areaOfInterest: "DSP, Analog & Digital Circuits, Nonlinear Systems, Robust Stability.",
      phone: "+91-532-2271465(O), +91-532-2271746(R)",
      email: "rao@mnnit.ac.in, krishnaraonit@yahoo.co.in"
    },
    {
      name: "Dr. Arvind Kumar",
      qualification: "Ph.D.",
      areaOfInterest: "Embedded Systems, Mobile Communication, Ad-hoc Networking.",
      phone: "+91-532-2271462(O), +91-532-2271944(R)",
      email: "arvindk@mnnit.ac.in"
    },
    {
      name: "Dr. Manish Tiwari",
      qualification: "Ph.D.",
      areaOfInterest: "Signal Processing, Multidimensional Systems, Embedded Systems.",
      phone: "+91-532-2271466(O)",
      email: "mtiwari@mnnit.ac.in"
    },
    {
      name: "Dr. Santosh Kumar Gupta",
      qualification: "Ph.D.",
      areaOfInterest: "Modeling of Semiconductor Devices.",
      phone: "+91-532-2271373(O), 1937(R)",
      email: "skg@mnnit.ac.in"
    },
    {
      name: "Mr. Asim Mukherjee",
      qualification: "M.Tech.",
      areaOfInterest: "Optical Communication, Queuing Systems, Random Signals.",
      phone: "+91-532-2271459(O), +91-532-2271930(R)",
      email: "asimmkj@mnnit.ac.in, asimmkj848@gmail.com"
    },
    {
      name: "Dr. Rajeev Gupta",
      qualification: "Ph.D.",
      areaOfInterest: "Biomedical Image Processing, Microwave Circuits, Antennas.",
      phone: "+91-532-2271469(O), +91-532-2271733(R), 9935720179(M)",
      email: "rajeevg@mnnit.ac.in"
    },
    {
      name: "Dr. Shweta Tripathi",
      qualification: "Ph.D.",
      areaOfInterest: "Semiconductor Devices, Reverse Engineering, Cost Optimization.",
      phone: "0532-2271467",
      email: "shtri@mnnit.ac.in"
    },
    {
      name: "Dr. Vinay Kumar",
      qualification: "Ph.D.",
      areaOfInterest: "Wireless Communications, WSNs, MI-based Communications.",
      phone: "+91-8830156094",
      email: "vinay.k@mnnit.ac.in, vinayrel01@gmail.com"
    },
    {
      name: "Dr. P. Karuppanan",
      qualification: "Ph.D.",
      areaOfInterest: "Analog/Digital VLSI Design, Embedded System, Renewable Energy.",
      phone: "+91-9455316475",
      email: "pkaru@mnnit.ac.in"
    },
    {
      name: "Dr. Anand Sharma",
      qualification: "B.Tech., M.Tech., Ph.D.",
      areaOfInterest: "Dielectric Resonator Antenna, MIMO, Printed Antennas.",
      phone: "9456416592",
      email: "anandsharma@mnnit.ac.in"
    },
    {
      name: "Dr. Sumit Kumar Jha",
      qualification: "B.Tech., M.Tech., Ph.D.",
      areaOfInterest: "Adaptive Control, Dynamic Programming, Reinforcement Learning.",
      phone: "+91-7838279747",
      email: "sumit-k@mnnit.ac.in"
    },
    {
      name: "Dr. Smriti Agarwal",
      qualification: "B.Tech., M.Tech., Ph.D.",
      areaOfInterest: "Radar Imaging, GPR, EM Characterization, Planar Antennas.",
      phone: "0532-2271451(O)",
      email: "smritiagarwal@mnnit.ac.in, smritiagarwal127@gmail.com"
    },
    {
      name: "Dr. Satish Chandra",
      qualification: "PDF (IIT Gandhinagar), Ph.D., M.Tech. (IIT ISM Dhanbad)",
      areaOfInterest: "Electronic Materials, SHG, THG, Ternary Semiconductors, 2D Materials.",
      phone: "+91-9532997798",
      email: "satishchandra@mnnit.ac.in"
    },
    {
      name: "Dr. Deepak Punetha",
      qualification: "B.Tech., M.E., Ph.D.",
      areaOfInterest: "Semiconductor Thin Films, Nanogenerators, VLSI, Sensors.",
      phone: "",
      email: "deepakpunetha@mnnit.ac.in"
    },
    {
      name: "Dr. Dharmendra Dixit",
      qualification: "B.Tech., M.Tech., Ph.D.",
      areaOfInterest: "Mobile Comms, IRS, UAVs, RF Energy Harvesting, THz Channels.",
      phone: "",
      email: "dharmendradixit@mnnit.ac.in"
    },
    {
      name: "Dr. Arun Kumar Saurabh",
      qualification: "B.Tech., M.Tech., Ph.D.",
      areaOfInterest: "MIMO Antennas, 5G/6G, Body Area Networks, Reflect Arrays.",
      phone: "",
      email: "aksaurabh@mnnit.ac.in"
    },
    {
        name: "Dr. KUMARI NIBHA PRIYADARSHANI",
        qualification: "Ph.D. National Institute of Technology Patna",
        areaOfInterest: "Beyond CMOS Transistor, Sensors, Tunnel FET",
        phone: "",
        email: "knpriya@mnnit.ac.in"
      },
      {
        name: "Dr. SANDEEP KUMAR SINGH",
        qualification: "B.Tech., M.Tech., Ph.D.",
        areaOfInterest: "RSMA, NOMA, RIS, UAV, V2X, Massive MIMO.",
        phone: "08319371716(O) 08319371716(M)",
        email: "sksingh@mnnit.ac.in"
      },
      {
        name: "Dr. Nirmal Ch Roy",
        qualification: "B.Tech., M.Tech., Ph.D.",
        areaOfInterest: "Nanoelectronics, Nanomaterials, Chemical sensor, Gas sensor, and Biosensor, POCT Devices, VLSI Design, Semiconductor Device Modeling, Optoelectronic Devices, Supercapacitor, Flexible Electronics, Photodetector",
        phone: "",
        email: "nirmalroy@mnnit.ac.in"
      },
      {
        name: "Dr. Shishir Maheshwari",
        qualification: "Ph.D: IIT Indore, MTech: NIT Rourkela",
        areaOfInterest: "Signal and Image Processing, Biomedical Signal and Image Analysis, Machine/Deep Learning.",
        phone: "",
        email: "shishirm@mnnit.ac.in"
      },
      {
        name: "Dr. Sachin Kadam",
        qualification: "Ph.D: IIT Bombay, MTech: IIT Kanpur, Postdocs: SKKU, South Korea; ASU, USA",
        areaOfInterest: "Semantic Communications , Wireless Networks, IoT Communication Networks, Network Security Differential Privacy, ML/DL applied in Communications",
        phone: "",
        email: "sachink@mnnit.ac.in"
      },
  ];
  
  export default professors;  