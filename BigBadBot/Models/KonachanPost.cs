using System;
using System.Xml.Serialization;

namespace BigBadBot.Models
{
    [XmlRoot("post")]
    public class KonachanPost
    {
        [XmlAttribute("author")]
        public string Author { get; set; }
        [XmlAttribute("file_url")]
        public string FileUrl { get; set; }
        [XmlAttribute("jpeg_url")]
        public string JpegUrl { get; set; }
        [XmlAttribute("rating")]
        public string Rating { get; set; }
        [XmlAttribute("score")]
        public string Score { get; set; }
        [XmlAttribute("tags")]
        public string Tags { get; set; }

    }
}