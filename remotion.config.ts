import {Config} from '@remotion/cli/config';

// Remotion giriş dosyası
Config.setEntryPoint('./src/index.ts');

// YouTube Shorts için MP4 / H.264
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');

// Hız ve kalite dengesi
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);

// GitHub Actions runner kaynaklarını aşırı zorlamasın
Config.setConcurrency('50%');

// Ses kalitesi
Config.setAudioBitrate('192K');
Config.setSampleRate(48000);

// Cloudinary üzerindeki uzaktaki dosyaların yüklenmesi için
// tek kareye daha uzun süre tanıyoruz.
Config.setDelayRenderTimeoutInMilliseconds(120000);

// Aynı isimli çıktı varsa üzerine yaz
Config.setOverwriteOutput(true);

// Varsayılan çıktı konumu
Config.setOutputLocation('out/video.mp4');

// GitHub Actions loglarında ilerlemeyi görebilelim
Config.setLogLevel('info');
