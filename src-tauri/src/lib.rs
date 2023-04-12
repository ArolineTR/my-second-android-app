// use std::io::Write;
use csv::{Reader, ReaderBuilder};
use serde::{Deserialize, Serialize};
use std::{fs::File, time::Duration, fmt::format};
use std::io::{Write, BufReader, BufRead, Error};


#[derive(Debug, Serialize, Deserialize)]
struct Product {
    id: String,
    description: String,
    description2: String,
    barcode: String,
    zero: String,
    md: String,
    field1: String,
    field2: String,
    field3: String,
}

// use android_ndk::jni::JNIEnv;
// use android_ndk::native_activity::NativeActivity;

// #[no_mangle]
// pub extern "C" fn get_files_dir(activity: *mut NativeActivity) -> String {
//     let env = unsafe { JNIEnv::from_raw((*activity).env) };

//     let context_class = env.find_class("android/content/Context").unwrap();
//     let get_files_dir_method = env.get_method_id(context_class, "getFilesDir", "()Ljava/io/File;").unwrap();
//     let files_dir_obj = env.call_method(*(*activity).clazz, get_files_dir_method, &[]).unwrap().l().unwrap();

//     let file_class = env.find_class("java/io/File").unwrap();
//     let get_path_method = env.get_method_id(file_class, "getPath", "()Ljava/lang/String;").unwrap();
//     let path_string = env.call_method(files_dir_obj, get_path_method, &[]).unwrap().l().unwrap();

//     env.get_string_utf_chars(path_string).unwrap().into()
// }



#[tauri::command]
fn check_barcode(name: &str) -> String {
    let mut result = String::new();
    let file = std::fs::File::open("/sdcard/Download/ProdProfile.psv").expect("cannot open file");
    let mut rdr = ReaderBuilder::new()
        .has_headers(false)
        .delimiter(b'|')
        .from_reader(file);
    for record in rdr.deserialize() {
        let res: Product = record.expect("failed to parse");
        if res.barcode.eq(name) {
            result.push_str(&format!("{}\n Barcode: {}\n", res.description, res.barcode));
        }
    }

    if result.is_empty() {
        format!("No product found with barcode {}", name)
    } else {
        result
    }
}

#[tauri::command]
fn greet_folder(name: &str) {
    // std::fs::DirEntry::path(&self)
    // let path = "/sdcard/Download/tes";
    // std::fs::DirBuilder::new()
    //     .recursive(true)
    //     .create(path).unwrap();

    // assert!(std::fs::metadata(path).unwrap().is_dir());
    let path = "/sdcard/".to_owned() + name;
    std::fs::create_dir_all(&path).expect("Unable to create folder");
    // let mut file = std::fs::File::create("/sdcard/Download/files.txt").expect("Unable to create file");

    // // Write the name to the file
    // file.write(name.to_owned().as_bytes()).expect("Error");

}

#[tauri::command]
fn greetFile(hasil: &str, date: &str){
    let path = "/sdcard/Download/".to_owned() + "Receipt " + date + ".txt";

    let mut file = std::fs::File::create(&path).expect("Unable to create file");

    // Write the name to the file
    file.write(hasil.to_owned().as_bytes()).expect("Error");
    

}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // greet
            greetFile
            ,greet_folder
            // ,check_barcode
            ,check_barcode
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
