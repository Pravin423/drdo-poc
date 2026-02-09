--- c:\Users\Pravin\Desktop\topsecret(kiran)\dgoa\src\pages\dashboard\attandence.js
+++ c:\Users\Pravin\Desktop\topsecret(kiran)\dgoa\src\pages\dashboard\attandence.js
@@ -111,7 +111,9 @@
                 {activeTab === "overview" && <OverviewGrid />}
                 {activeTab === "masterRole" && <MusterRollTab />}
                 {activeTab === "regularization" && <RegularizationTab />}
-                {activeTab === "gisMap" && <GISMapTab />}
+                {activeTab === "gisMap" && (
+                  <div className="w-full h-[calc(100vh-250px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
+                    <GISMapTab />
+                  </div>
+                )}
               </motion.div>
             </AnimatePresence>
           </div>
