package pkg

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"io/fs"
	"path/filepath"
	"strings"

	"github.com/psanford/memfs"
)

// Unzip extract a zipFile to a memfs.FS
func Unzip(zipFIle fs.File) (*memfs.FS, error) {

	stat, err := zipFIle.Stat()
	if err != nil {
		return nil, err
	}

	buf := make([]byte, stat.Size())
	read, err := zipFIle.Read(buf)
	if err != nil {
		return nil, err
	}

	if read != int(stat.Size()) {
		return nil, fmt.Errorf("expected %d bytes, got %d", stat.Size(), read)
	}

	r := bytes.NewReader(buf)

	reader, err := zip.NewReader(r, stat.Size())
	if err != nil {
		return nil, err
	}

	rootFS := memfs.New()

	err = unzip(reader, rootFS)
	if err != nil {
		return nil, err
	}
	return rootFS, nil
}

// https://stackoverflow.com/a/24792688
// unzip extract a zip file to memfs
func unzip(zipReader *zip.Reader, fs *memfs.FS) error {

	// Closure to address file descriptors issue with all the deferred .Close() methods
	extractAndWriteFile := func(f *zip.File) error {
		rc, err := f.Open()
		if err != nil {
			panic(err)
		}
		defer func() {
			if err := rc.Close(); err != nil {
				panic(err)
			}
		}()

		path := f.Name

		//// Check for ZipSlip (Directory traversal)
		//if !strings.HasPrefix(path, filepath.Clean("/")+string(os.PathSeparator)) {
		//	return fmt.Errorf("illegal file path: %s", path)
		//}

		if f.FileInfo().IsDir() {
			err := fs.MkdirAll(strings.TrimSuffix(path, "/"), f.Mode())
			if err != nil {
				panic(err)
			}
		} else {
			err := fs.MkdirAll(filepath.Dir(path), f.Mode())
			if err != nil {
				panic(err)
			}

			data, err := io.ReadAll(rc)
			if err != nil {
				panic(err)

			}
			err = fs.WriteFile(path, data, 0755)

			if err != nil {
				panic(err)
			}
		}
		return nil
	}

	for _, f := range zipReader.File {
		err := extractAndWriteFile(f)
		if err != nil {
			panic(err)
		}
	}

	return nil
}
